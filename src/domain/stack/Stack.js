import s from 'string';
import Server from '../server/Server';
import Group from './Group';
import proptypeable from 'junction-proptype-decorator';
import normalizable from 'junction-normalizr-decorator';

@proptypeable
@normalizable({idAttribute: 'slug'})
class Stack {

  diff;
  servers = [];
  groups = [];

  constructor(title, gitPath) {
    this.title = title;
    this.slug = s(this.title).slugify().s;
    this.gitPath = gitPath;
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
