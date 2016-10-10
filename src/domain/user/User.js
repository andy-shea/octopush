import normalizable from 'junction-normalizr-decorator';

@normalizable()
class User {

  id;
  password;
  resetPasswordToken;
  resetPasswordExpires;

  constructor(name, email) {
    this.name = name;
    this.email = email;
  }
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
