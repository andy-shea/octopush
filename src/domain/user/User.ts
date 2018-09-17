import normalizable from 'junction-normalizr-decorator';
import {Entity, SchemaTypes} from 'junction-orm/lib/Entity';
import {Authenticatable} from 'node-password-util';

@normalizable()
class User implements Entity, Authenticatable {

  static schema = {
    type: SchemaTypes.ENTITY,
    props: {
      name: {},
      email: {},
      password: {},
      resetPasswordToken: {},
      resetPasswordExpires: {}
    }
  };

  id?: number;
  password?: string;
  resetPasswordToken?: string;
  resetPasswordExpires?: number;

  constructor(public name: string, public email: string) {
    this.name = name;
    this.email = email;
  }
}

export default User;
