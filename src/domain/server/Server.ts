import normalizable from 'junction-normalizr-decorator';
import proptypeable from 'junction-proptype-decorator';

@proptypeable
@normalizable()
class Server {

  static schema: object;

  constructor(public hostname: string) {}

}

Server.schema = {
  type: 'entity',
  props: {
    hostname: {
      type: 'string',
      isRequired: true
    }
  }
};

export default Server;
