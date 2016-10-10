import Promise from 'bluebird';
import db from '~/persistence';
import serverMapper from './servers';
import stackMapper from './stacks';
import deployMapper from './deploys';
import userMapper from './users';

const mappers = {
  Server: serverMapper,
  Stack: stackMapper,
  Deploy: deployMapper,
  User: userMapper
};

function getMapper(klass) {
  if (!mappers[klass]) throw Error('No mapper found for class');
  return mappers[klass];
}

const mapper = {
  preFlush() {
    return new Promise(fulfill => {
      db.transaction(trx => {
        this.trx = trx;
        fulfill();
      });
    });
  },

  insert(entityMap) {
    const promises = Object.keys(entityMap).map(klass => {
      return getMapper(klass).insert(this.trx, entityMap[klass]);
    });
    return Promise.all(promises);
  },

  update(observerMap) {
    const promises = Object.keys(observerMap).map(klass => {
      return getMapper(klass).update(this.trx, observerMap[klass]);
    });
    return Promise.all(promises);
  },

  delete(entityMap) {
    const promises = Object.keys(entityMap).map(klass => {
      return getMapper(klass).delete(this.trx, entityMap[klass]);
    });
    return Promise.all(promises);
  },

  postFlush(err) {
    if (err) {
      // TODO: issue if rollback throws error?
      // returning this promise and rethrowing the error in the then-block will
      // cause a "promise was rejected with a non-error" warning
      this.trx.rollback().then(() => {
        delete this.trx;
      });
      throw err;
    }
    return this.trx.commit().then(() => {
      delete this.trx;
      return null;
    });
  }
};

export default mapper;
