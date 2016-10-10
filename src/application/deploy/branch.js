import Promise from 'bluebird';
import git from 'gift';
import logger from '~/infrastructure/logger';

export function getBranches(stack) {
  return new Promise(fulfill => {
    if (process.env.NODE_ENV === 'development') fulfill(['Test', 'Prod']);
    else {
      git(stack.gitPath).branches((err, branches) => {
        if (err) {
          logger.error(err);
          fulfill(null);
        }
        else {
          let branchNames = branches.map(branch => branch.name);
          branchNames.sort();
          const masterIndex = branchNames.indexOf('master');
          if (masterIndex !== -1) {
            branchNames.splice(masterIndex, 1);
            branchNames.unshift('Test', 'Prod');
          }
          fulfill(branchNames);
        }
      });
    }
  });
}
