import {Entity, Schema, SchemaTypes} from 'junction-orm/lib/Entity';
import proptypeable from 'junction-proptype-decorator';
import Server from '../server/Server';

// TODO: should this be Embedded not Entity (i.e. does it need an ID)?
@proptypeable
class Group implements Entity {

  static schema: Schema = {
    type: SchemaTypes.EMBEDDED,
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

  public id?: number;

  constructor(public name: string, public servers: Server[]) {
    this.name = name;
    this.servers = servers;
  }

}

export default Group;
