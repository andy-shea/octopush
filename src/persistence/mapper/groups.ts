import {all} from 'awaity/esm';
import EntityObserver from 'junction-orm/lib/observer/EntityObserver';
import {Transaction} from 'knex';
import Server from '~/domain/server/Server';
import Group from '~/domain/stack/Group';
import Stack from '~/domain/stack/Stack';
import db from '~/persistence';

const {schema: {props: schemaProps}} = Group;

function updateGroup(group: Group, trx: Transaction, props: string[]): any {  
  const values = props.reduce((map: any, prop) => {
    map[schemaProps[prop].column || prop] = (group as any)[prop];
    return map;
  }, {});
  return db('groups')
    .transacting(trx)
    .where({id: group.id})
    .update(values);
}

function insertServers(trx: Transaction, group: Group, servers: Server[]): any {
  const values = servers.map(server => ({server_id: server.id, group_id: group.id}));
  return db('groups_servers')
    .transacting(trx)
    .insert(values);
}

function deleteServers(trx: Transaction, group: Group, servers: Server[]): any {
  const serverIds = servers.map(server => server.id) as number[];
  return db('groups_servers')
    .transacting(trx)
    .whereIn('server_id', serverIds)
    .andWhere('group_id', group.id as number)
    .del();
}

function updateCollections(observer: EntityObserver, trx: Transaction): Array<Promise<any>> {
  const mods: Array<Promise<any>> = [];
  const {
    entity,
    collections: {
      servers: {added, removed}
    }
  } = observer;
  if (added.length) mods.push(insertServers(trx, entity as Group, added as Server[]));
  if (removed.length) mods.push(deleteServers(trx, entity as Group, removed as Server[]));
  return mods;
}

const mapper = {
  async insert(trx: Transaction, groups: Group[], stack: Stack) {
    const values = groups.map(group => ({name: group.name, stack_id: stack.id}));
    const ids = await db('groups')
      .transacting(trx)
      .insert(values, 'id');
    return all(
      ids.map((id: number, index: number) => {
        const group = groups[index];
        group.id = id;
        return insertServers(trx, group, group.servers);
      })
    );
  },

  update(trx: Transaction, observers: EntityObserver[]) {
    return Promise.all(
      observers.reduce((mods: Array<Promise<any>>, observer) => {
        const {entity} = observer;
        const {props, collections} = observer.changed();
        if (props.length) mods.push(updateGroup(entity as Group, trx, props));
        if (collections.length) mods.push(...updateCollections(observer, trx));
        return mods;
      }, [])
    );
  },

  async delete(trx: Transaction, groups: Group[]) {
    const groupIds = groups.map(group => group.id) as number[];
    await db('groups_servers')
      .transacting(trx)
      .whereIn('group_id', groupIds)
      .del();
    await db('groups')
      .transacting(trx)
      .whereIn('id', groupIds)
      .del();
  }
};

export default mapper;
