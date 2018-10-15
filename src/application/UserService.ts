import {hash} from 'node-password-util';
import User from '~/domain/user/User';
import UserRepository from '~/domain/user/UserRepository';

class UserService {

  constructor(private userRepo: UserRepository) {
    this.userRepo = userRepo;
  }

  async addUser(name: string, email: string, password: string) {
    const user = new User(name, email);
    user.password = password;
    await hash(user);
    await this.userRepo.add(user);
    return user;
  }

}

export default UserService;
