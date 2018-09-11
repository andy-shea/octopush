import normalizable from 'junction-normalizr-decorator';

@normalizable()
class User {

  static schema: object;

  id: number | undefined;
  password: string | undefined;
  resetPasswordToken: string | undefined;
  resetPasswordExpires: string | undefined;

  constructor(public name: string, public email: string) {}
}

User.schema = {
  type: 'entity',
  props: {
    name: {},
    email: {},
    password: {},
    resetPasswordToken: {},
    resetPasswordExpires: {}
  }
};

export default User;
