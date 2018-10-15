import autobind from 'autobind-decorator';
import db from '~/persistence';
import NotFoundError from '../NotFoundError';
import Repository from '../Repository';
import User from './User';

const baseFindQuery = db('users').select('id', 'name', 'email');

interface UserMap {
  [id: number]: User;
}

class UserRepository extends Repository {

  @autobind
  __restore(userData: any) {
    if (!userData) throw new NotFoundError('No user found');
    if (this.session.has('User', userData.id)) {
      return this.session.retrieve('User', userData.id) as User;
    }
    const user = new User(userData.name, userData.email);
    user.id = userData.id;
    if (userData.password) user.password = userData.password;
    return this.session ? this.session.track(user) as User : user as User;
  }

  async findById(id: number) {
    const userData = await baseFindQuery
      .clone()
      .where({id})
      .first();
    return this.__restore(userData);
  }

  findByIds(ids: number[]) {
    return baseFindQuery
      .clone()
      .where('id', 'in', ids)
      .reduce((map: UserMap, userData: any) => {
        map[userData.id] = this.__restore(userData);
        return map;
      }, {});
  }

  async findByEmail(email: string) {
    const userData = await baseFindQuery
      .clone()
      .select('password')
      .where({email})
      .first();
    return this.__restore(userData);
  }
}

export default UserRepository;
