import normalizable from 'junction-normalizr-decorator';
import {Entity, Schema, SchemaTypes, Timestampable} from 'junction-orm/lib/Entity';
import Stack from '../stack/Stack';
import User from '../user/User';

@normalizable()
class Deploy implements Entity, Timestampable {

  static schema: Schema = {
    type: SchemaTypes.ENTITY,
    timestampable: true,
    props: {
      branch: {},
      user: {
        type: User
      },
      stack: {
        type: Stack
      },
      logFile: {},
      hosts: {
        type: 'json'
      }
    }
  };

  id?: number;
  hosts: object[] = [];
  createdAt?: Date;
  updatedAt?: Date;
  logFile?: string;

  constructor(public branch: string, public user: User, public stack?: Stack) {
    this.branch = branch;
    this.user = user;
    this.stack = stack;
  }

}

export default Deploy;
