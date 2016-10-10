import proptypeable from 'junction-proptype-decorator';
import normalizable from 'junction-normalizr-decorator';

@proptypeable
@normalizable()
class Server {
  constructor(hostname) {
    this.hostname = hostname;
  }
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
