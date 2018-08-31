import Repository from '../Repository';
import autobind from 'autobind-decorator';
import {Injectable} from 'angular2-di';
import {Session} from 'junction-orm/lib/startSession';
import User from './User';
import db from '~/persistence';

const baseFindQuery = db('users').select('id', 'name', 'email');

@Injectable()
class UserRepository extends Repository {

  constructor(session: Session) {
    super();
    this.session = session;
  }

  @autobind
  __restore(userData) {
    if (!userData) return false;
    if (this.session.has('User', userData.id)) return this.session.retrieve('User', userData.id);
    const user = new User(userData.name, userData.email);
    user.id = userData.id;
    if (userData.password) user.password = userData.password;
    return this.session ? this.session.track(user) : user;
  }

  async findById(id) {
    const userData = await baseFindQuery
      .clone()
      .where({id})
      .first();
    return this.__restore(userData);
  }

  findByIds(ids) {
    return baseFindQuery
      .clone()
      .where('id', 'in', ids)
      .reduce((map, userData) => {
        map[userData.id] = this.__restore(userData);
        return map;
      }, {});
  }

  async findByEmail(email) {
    const userData = await baseFindQuery
      .clone()
      .select('password')
      .where({email})
      .first();
    return this.__restore(userData);
  }

}

export default UserRepository;
