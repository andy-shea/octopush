import db from '~/persistence';
import Server from '~/domain/server/Server';

const mapper = {
  async insert(trx, servers) {
    const values = servers.map(server => ({
      hostname: server.hostname,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }));
    const ids = await db('servers')
      .transacting(trx)
      .insert(values, 'id');
    ids.map((id, index) => {
      servers[index].id = id;
    });
  },

  update(trx, observers) {
    return Promise.all(
      observers.reduce((mods, observer) => {
        const {entity} = observer;
        const {props} = observer.changed();
        const {
          schema: {props: schemaProps}
        } = Server;
        const values = props.reduce((map, prop) => {
          map[schemaProps[prop].column || prop] = entity[prop];
          return map;
        }, {});
        values.updated_at = db.fn.now();
        mods.push(
          db('servers')
            .transacting(trx)
            .where({id: entity.id})
            .update(values)
        );
        return mods;
      }, [])
    );
  },

  async delete(trx, servers) {
    const serverIds = servers.map(server => server.id);
    await db('servers_stacks')
      .transacting(trx)
      .whereIn('server_id', serverIds)
      .del();
    await db('groups_servers')
      .transacting(trx)
      .whereIn('server_id', serverIds)
      .del();
    await db('servers')
      .transacting(trx)
      .whereIn('id', serverIds)
      .del();
  }
};

export default mapper;
