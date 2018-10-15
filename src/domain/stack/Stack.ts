import normalizable from 'junction-normalizr-decorator';
import {Entity, Schema, SchemaTypes} from 'junction-orm/lib/Entity';
import proptypeable from 'junction-proptype-decorator';
import s from 'string';
import Server from '../server/Server';
import Group from './Group';

@proptypeable
@normalizable({idAttribute: 'slug'})
class Stack implements Entity {

  static schema: Schema = {
    type: SchemaTypes.ENTITY,
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

  id?: number;
  diff?: string;
  slug: string;
  servers: Server[] = [];
  groups: Group[] = [];

  constructor(public title: string, public gitPath: string) {
    this.title = title;
    this.gitPath = gitPath;
    this.slug = s(this.title).slugify().s;
  }

}

export default Stack;
