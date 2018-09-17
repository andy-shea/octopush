import normalizable from 'junction-normalizr-decorator';
import {Entity, SchemaTypes} from 'junction-orm/lib/Entity';
import proptypeable from 'junction-proptype-decorator';

@proptypeable
@normalizable()
class Server implements Entity {

  static schema = {
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
