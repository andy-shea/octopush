import Stack from '../stack/Stack';
import User from '../user/User';
import normalizable from 'junction-normalizr-decorator';

@normalizable()
class Deploy {

  hosts = [];

  constructor(branch, user, stack) {
    this.branch = branch;
    this.user = user;
    this.stack = stack;
  }

}

Deploy.schema = {
  type: 'entity',
  timestampable: true,
  props: {
    branch: {},
    user: {
      type: User
    },
    stack: {
      type: Stack
    },
    logFile: {},
    hosts: {type: 'json'}
  }
};

export default Deploy;
