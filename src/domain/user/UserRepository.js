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

  findById(id) {
    return baseFindQuery.clone().where({id}).first().then(this.__restore);
  }

  findByIds(ids) {
    return baseFindQuery.clone().where('id', 'in', ids).reduce((map, userData) => {
      map[userData.id] = this.__restore(userData);
      return map;
    }, {});
  }

  findByEmail(email) {
    return baseFindQuery.clone().select('password').where({email}).first().then(this.__restore);
  }

}

export default UserRepository;
