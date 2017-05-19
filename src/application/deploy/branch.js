import Promise from 'bluebird';
import git from 'gift';
import GitHubApi from 'github';
import logger from '~/infrastructure/logger';

const githubPrefix = 'https://github.com/';

const github = new GitHubApi({
  debug: (process.env.NODE_ENV === 'development'),
  protocol: 'https',
  host: 'api.github.com',
  Promise,
  timeout: 5000
});

function getLocalBranches(gitPath) {
  return new Promise((resolve, reject) => {
    git(gitPath).branches((err, branches) => {
      if (err) reject(err);
      else resolve(branches);
    });
  });
}

function getGithubBranches(gitPath) {
  const [owner, repo] = gitPath.replace(githubPrefix, '').replace('.git', '').split('/');
  return new Promise((resolve, reject) => {
    github.repos.getBranches({owner, repo}, (err, res) => {
      if (err) reject(err);
      else resolve(res.data);
    });
  });
}

export function getBranches({gitPath}) {
  if (process.env.NODE_ENV === 'development' && !gitPath.startsWith(githubPrefix)) {
    return Promise.resolve(['Test', 'Prod']);
  }

  const getBranchesMeta = gitPath.startsWith(githubPrefix) ? getGithubBranches : getLocalBranches;
  return getBranchesMeta(gitPath).then(branches => {
    let branchNames = branches.map(({name}) => name);
    branchNames.sort();
    const masterIndex = branchNames.indexOf('master');
    if (masterIndex !== -1) {
      branchNames.splice(masterIndex, 1);
      branchNames.unshift('Test', 'Prod');
    }
    return branchNames;
  }).catch(err => {
    logger.error(err);
  });
}
