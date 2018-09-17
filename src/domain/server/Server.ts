import normalizable from 'junction-normalizr-decorator';
import {Entity, Schema, SchemaTypes} from 'junction-orm/lib/Entity';
import proptypeable from 'junction-proptype-decorator';

@proptypeable
@normalizable()
class Server implements Entity {

  static schema: Schema = {
    type: SchemaTypes.ENTITY,
    props: {
      hostname: {
        type: 'string',
        isRequired: true
      }
    }
  };

  id?: number;

  constructor(public hostname: string) {
    this.hostname = hostname;
  }

}

export default Server;
