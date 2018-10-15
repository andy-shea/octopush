import Octokit from '@octokit/rest';
import git from 'gift';
import Stack from '~/domain/stack/Stack';
import logger from '~/infrastructure/logger';

const githubPrefix = 'https://github.com/';

const github = new Octokit({timeout: 5000});

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
    .replace(githubPrefix, '')
    .replace('.git', '')
    .split('/');
  return new Promise((resolve, reject) => {
    github.repos.getBranches({owner, repo}, (error: Error | null, response) => {
      if (error) reject(error);
      else resolve(response.data);
    });
  });
}

export async function getBranches({gitPath}: Stack) {
  if (process.env.NODE_ENV === 'development' && !gitPath.startsWith(githubPrefix)) {
    return Promise.resolve(['Test', 'Prod']);
  }

  const getBranchesMeta = gitPath.startsWith(githubPrefix) ? getGithubBranches : getLocalBranches;
  try {
    const branches = await getBranchesMeta(gitPath);
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
