import {Injectable} from 'angular2-di';
import {hash} from 'node-password-util';
import User from '~/domain/user/User';
import UserRepository from '~/domain/user/UserRepository';

@Injectable()
class UserService {

  constructor(userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  addUser(name, email, password) {
    const user = new User(name, email);
    user.password = password;
    return hash(user).then(() => this.userRepo.add(user)).then(() => user);
  }

}

export default UserService;
