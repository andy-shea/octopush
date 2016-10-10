import Promise from 'bluebird';
import db from '~/persistence';
import Server from '~/domain/server/Server';

const mapper = {
  insert(trx, servers) {
    const values = servers.map(server => ({hostname: server.hostname, created_at: db.fn.now(), updated_at: db.fn.now()}));
    return db('servers').transacting(trx).insert(values, 'id').then(ids => {
      ids.map((id, index) => {
        servers[index].id = id;
      });
    });
  },

  update(trx, observers) {
    return Promise.all(observers.reduce((mods, observer) => {
      const {entity} = observer;
      const {props} = observer.changed();
      const {schema: {props: schemaProps}} = Server;
      const values = props.reduce((map, prop) => {
        map[schemaProps[prop].column || prop] = entity[prop];
        return map;
      }, {});
      values.updated_at = db.fn.now();
      mods.push(db('servers').transacting(trx).where({id: entity.id}).update(values));
      return mods;
    }, []));
  },

  delete(trx, servers) {
    const serverIds = servers.map(server => server.id);
    return db('servers_stacks').transacting(trx).whereIn('server_id', serverIds).del()
        .then(() => db('groups_servers').transacting(trx).whereIn('server_id', serverIds).del())
        .then(() => db('servers').transacting(trx).whereIn('id', serverIds).del());
  }
};

export default mapper;
