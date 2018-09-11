import normalizable from 'junction-normalizr-decorator';
import Stack from '../stack/Stack';
import User from '../user/User';

@normalizable()
class Deploy {

  static schema: object;

  hosts = [];

  constructor(public branch: string, public user: User, public stack: Stack) {}

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
