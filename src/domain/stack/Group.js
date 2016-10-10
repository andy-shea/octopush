import Server from '../server/Server';
import proptypeable from 'junction-proptype-decorator';

@proptypeable
class Group {
  constructor(name, servers) {
    this.name = name;
    this.servers = servers;
  }
}

Group.schema = {
  type: 'embedded',
  props: {
    name: {
      type: 'string',
      isRequired: true
    }
  },
  collections: {
    servers: {
      element: Server
    }
  }
};

export default Group;
