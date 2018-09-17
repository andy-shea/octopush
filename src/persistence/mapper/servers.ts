import Server from '~/domain/server/Server';
import db from '~/persistence';
import EntityMapper from './mapper';

const {schema: {props: schemaProps}} = Server;

const mapper: EntityMapper = {
  async insert(trx, servers: Server[]) {
    const values = servers.map(server => ({
      hostname: server.hostname,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }));
    const ids = await db('servers')
      .transacting(trx)
      .insert(values, 'id');
    ids.map((id: number, index: number) => {
      servers[index].id = id;
    });
  },

  update(trx, observers) {
    return Promise.all(
      observers.reduce((mods: Array<Promise<any>>, observer) => {
        const {entity} = observer;
        const {props} = observer.changed();
        const values = props.reduce((map: any, prop) => {
          map[schemaProps[prop].column || prop] = (entity as any)[prop];
          return map;
        }, {});
        values.updated_at = db.fn.now();
        mods.push(
          db('servers')
            .transacting(trx)
            .where({id: entity.id})
            .update(values) as any
        );
        return mods;
      }, [])
    );
  },

  async delete(trx, servers) {
    const serverIds = servers.map(server => server.id) as number[];
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
