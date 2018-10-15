import {Entity} from 'junction-orm/lib/Entity';
import Session from 'junction-orm/lib/Session';

class Repository {

  constructor(protected session: Session) {
    this.session = session;
  }

  add(entity: Entity) {
    this.session.add(entity);
  }

  remove(entity: Entity) {
    this.session.remove(entity);
  }

}

export default Repository;
