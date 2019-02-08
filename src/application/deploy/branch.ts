import Octokit from '@octokit/rest';
import config from 'config';
import withDefaults from 'ftchr';
import git from 'gift';
import Stack from '~/domain/stack/Stack';
import logger from '~/infrastructure/logger';

const GITHUB_PREFIX = 'https://github.com/';
const BITBUCKET_PREFIX = 'https://bitbucket.org/';

const github = new Octokit({timeout: 5000});
const {get} = withDefaults({
  credentials: 'same-origin',
  headers: {
    Authorization: `Basic ${Buffer.from(`${config.get('bitbucket.username')}:${config.get('bitbucket.password')}`).toString('base64')}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
}, response => response.contents);

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
  return new Promise((resolve, reject) => {
    github.repos.getBranches({owner, repo}, (error: Error | null, response) => {
      if (error) reject(error);
      else resolve(response.data);
    });
  });
}

function getBitbucketBranches(gitPath: string): Promise<Branch[]> {
  const [owner, repo] = gitPath
    .replace(BITBUCKET_PREFIX, '')
    .replace('.git', '')
    .split('/');
  return get(`https://api.bitbucket.org/2.0/repositories/${owner}/${repo}/refs/branches`)
    .then(({values}) => values)
    .catch(error => {
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
  else if (isBitbucketRepo(gitPath)) return getBitbucketBranches(gitPath);
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
