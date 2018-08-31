import {Injectable} from 'angular2-di';
import {hash} from 'node-password-util';
import User from '~/domain/user/User';
import UserRepository from '~/domain/user/UserRepository';

@Injectable()
class UserService {

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async addUser(name, email, password) {
    const user = new User(name, email);
    user.password = password;
    await hash(user);
    await this.userRepo.add(user);
    return user;
  }

}

export default UserService;
