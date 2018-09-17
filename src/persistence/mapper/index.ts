import {Mapper as BaseMapper} from 'junction-orm/lib/mapper/Mapper';
import {DirtyEntities, DirtyObservers} from 'junction-orm/lib/UnitOfWork';
import {Transaction} from 'knex';
import db from '~/persistence';
import deployMapper from './deploys';
import EntityMapper from './mapper';
import serverMapper from './servers';
import stackMapper from './stacks';
import userMapper from './users';

interface Mappers {
  [type: string]: EntityMapper;
}

const mappers: Mappers = {
  Server: serverMapper,
  Stack: stackMapper,
  Deploy: deployMapper,
  User: userMapper
};

function getMapper(klass: string) {
  if (!mappers[klass]) throw Error('No mapper found for class');
  return mappers[klass];
}

interface Mapper extends BaseMapper {
  trx?: Transaction;
}

const mapper: Mapper = {
  preFlush() {
    return new Promise(fulfill => {
      db.transaction(trx => {
        this.trx = trx;
        fulfill();
      });
    });
  },

  insert(entityMap: DirtyEntities) {
    const promises = Object.keys(entityMap).map(klass => {
      return getMapper(klass).insert(this.trx as Transaction, entityMap[klass]);
    });
    return Promise.all(promises);
  },

  update(observerMap: DirtyObservers) {
    const promises = Object.keys(observerMap).map(klass => {
      return getMapper(klass).update(this.trx as Transaction, observerMap[klass]);
    });
    return Promise.all(promises);
  },

  delete(entityMap: DirtyEntities) {
    const promises = Object.keys(entityMap).map(klass => {
      return getMapper(klass).delete(this.trx as Transaction, entityMap[klass]);
    });
    return Promise.all(promises);
  },

  async postFlush(error?: Error) {
    if (error) {
      // TODO: issue if rollback throws error?
      // returning this promise and rethrowing the error in the then-block will
      // cause a "promise was rejected with a non-error" warning
      if (this.trx) {
        await this.trx.rollback();
        delete this.trx;
      }
      throw error;
    }
    if (this.trx) {
      await this.trx.commit();
      delete this.trx;
    }
  }
};

export default mapper;
