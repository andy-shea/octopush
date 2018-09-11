import proptypeable from 'junction-proptype-decorator';
import Server from '../server/Server';

@proptypeable
class Group {

  static schema: object;

  constructor(public name: string, public servers: Server[]) {}

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
