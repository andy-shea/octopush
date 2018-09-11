import normalizable from 'junction-normalizr-decorator';
import proptypeable from 'junction-proptype-decorator';
import s from 'string';
import Server from '../server/Server';
import Group from './Group';

@proptypeable
@normalizable({idAttribute: 'slug'})
class Stack {

  static schema: object;

  diff: string | undefined;
  slug: string;
  servers: Server[] = [];
  groups: Group[] = [];

  constructor(public title: string, public gitPath: string) {
    this.slug = s(this.title).slugify().s;
  }

}

Stack.schema = {
  type: 'entity',
  props: {
    title: {
      type: 'string',
      isRequired: true
    },
    slug: {
      type: 'string',
      isRequired: true
    },
    gitPath: {
      type: 'string',
      isRequired: true
    },
    diff: {type: 'string'}
  },
  collections: {
    servers: {
      element: Server
    },
    groups: {
      element: Group
    }
  }
};

export default Stack;
