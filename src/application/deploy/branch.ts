import config from 'config';
import withDefaults from 'ftchr';
import git from 'gift';
import Stack from '~/domain/stack/Stack';
import {get} from '~/infrastructure/fetch';
import logger from '~/infrastructure/logger';

const GITHUB_PREFIX = 'https://github.com/';
const BITBUCKET_PREFIX = 'https://bitbucket.org/';

let bitbucketGet: any;
if (config.has('bitbucket.username')) {
  const bitbucket = withDefaults({
    credentials: 'same-origin',
    headers: {
      Authorization: `Basic ${Buffer.from(`${config.get('bitbucket.username')}:${config.get('bitbucket.password')}`).toString('base64')}`,
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  }, response => response.contents);
  bitbucketGet = bitbucket.get;
}

interface Branch {
  name: string;
}

function getLocalBranches(gitPath: string): Promise<Branch[]> {
  return new Promise((resolve, reject) => {
    git(gitPath).branches((error: Error | null, branches: Branch[]) => {
      if (error) reject(error);
      else resolve(branches);
    });
  });
}

function getGithubBranches(gitPath: string): Promise<Branch[]> {
  const [owner, repo] = gitPath
    .replace(GITHUB_PREFIX, '')
    .replace('.git', '')
    .split('/');
  return get(`https://api.github.com/repos/${owner}/${repo}/branches`)
    .catch((error: any) => {
      logger.error(`Problem retrieving Bitbucket branches: ${error.statusText}`);
      return [];
    });
}

function getBitbucketBranches(gitPath: string): Promise<Branch[]> {
  const [owner, repo] = gitPath
    .replace(BITBUCKET_PREFIX, '')
    .replace('.git', '')
    .split('/');
  return bitbucketGet(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/refs/branches?pagelen=100`)
    .then(({values}: any) => values)
    .catch((error: any) => {
      logger.error(`Problem retrieving Bitbucket branches: ${error.statusText}`);
      return [];
    });
}

function isGithubRepo(gitPath: string): boolean {
  return gitPath.startsWith(GITHUB_PREFIX);
}

function isBitbucketRepo(gitPath: string): boolean {
  return gitPath.startsWith(BITBUCKET_PREFIX);
}

async function loadBranches(gitPath: string): Promise<Branch[]> {
  if (isGithubRepo(gitPath)) return getGithubBranches(gitPath);
  else if (isBitbucketRepo(gitPath)) {
    if (!bitbucketGet) throw new Error('Bitbucket credentials not set');
    return getBitbucketBranches(gitPath);
  }
  return getLocalBranches(gitPath);
}

export async function getBranches({gitPath}: Stack) {
  if (
    process.env.NODE_ENV === 'development'
    && !isGithubRepo(gitPath)
    && !isBitbucketRepo(gitPath)
  ) {
    return Promise.resolve(['Test', 'Prod']);
  }

  try {
    const branches = await loadBranches(gitPath);
    const branchNames = branches.map(({name}) => name);
    branchNames.sort();
    const masterIndex = branchNames.indexOf('master');
    if (masterIndex !== -1) {
      branchNames.splice(masterIndex, 1);
      branchNames.unshift('Test', 'Prod');
    }
    return branchNames;
  }
  catch (error) {
    logger.error(error);
    return [];
  }
}
