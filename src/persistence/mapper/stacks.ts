import {all} from 'awaity/esm';
import EntityObserver from 'junction-orm/lib/observer/EntityObserver';
import {Transaction} from 'knex';
import s from 'string';
import Server from '~/domain/server/Server';
import Group from '~/domain/stack/Group';
import Stack from '~/domain/stack/Stack';
import db from '~/persistence';
import groupMapper from './groups';
import EntityMapper from './mapper';

const {schema: {props: schemaProps}} = Stack;

function updateStack(stack: Stack, trx: Transaction, props: string[]): any {
  const values = props.reduce((map: any, prop) => {
    map[schemaProps[prop].column || s(prop).underscore().s] = (stack as any)[prop];
    return map;
  }, {});
  values.updated_at = db.fn.now();
  return db('stacks')
    .transacting(trx)
    .where({id: stack.id})
    .update(values);
}

function updateCollections(
  observer: EntityObserver,
  trx: Transaction,
  collections: string[]
): Array<Promise<any>> {
  const mods: Array<Promise<any>> = [];
  const {
    entity,
    collections: {servers, groups}
  } = observer;
  if (collections.indexOf('servers') !== -1) {
    const {added, removed} = servers.changed();
    if (added.length) mods.push(insertServers(trx, entity as Stack, added as Server[]));
    if (removed.length) mods.push(deleteServers(trx, entity as Stack, removed as Server[]));
  }
  if (collections.indexOf('groups') !== -1) {
    const {added, updated, removed} = groups.changed();
    if (added.length) mods.push(groupMapper.insert(trx, added as Group[], entity as Stack));
    if (updated.length) mods.push(groupMapper.update(trx, updated));
    if (removed.length) mods.push(groupMapper.delete(trx, removed as Group[]));
  }
  return mods;
}

function insertServers(trx: Transaction, stack: Stack, servers: Server[]): any {
  const values = servers.map(server => ({server_id: server.id, stack_id: stack.id}));
  return db('servers_stacks')
    .transacting(trx)
    .insert(values);
}

function deleteServers(trx: Transaction, stack: Stack, servers: Server[]): any {
  const serverIds = servers.map(server => server.id) as number[];
  return db('servers_stacks')
    .transacting(trx)
    .whereIn('server_id', serverIds)
    .andWhere('stack_id', stack.id as number)
    .del();
}

const mapper: EntityMapper = {
  async insert(trx, stacks: Stack[]) {
    const values = stacks.map(stack => ({
      title: stack.title,
      slug: stack.slug,
      git_path: stack.gitPath,
      diff: stack.diff,
      created_at: db.fn.now(),
      updated_at: db.fn.now()
    }));
    const ids = await db('stacks')
      .transacting(trx)
      .insert(values, 'id');
    return all(
      ids.map((id: number, index: number) => {
        const stack = stacks[index];
        stack.id = id;
        return insertServers(trx, stack, stack.servers);
      })
    );
  },

  update(trx, observers) {
    return Promise.all(
      observers.reduce((mods: Array<Promise<any>>, observer) => {
        const {entity} = observer;
        const {props, collections} = observer.changed();
        if (props.length) mods.push(updateStack(entity as Stack, trx, props));
        if (collections.length) mods.push(...updateCollections(observer, trx, collections));
        return mods;
      }, [])
    );
  },

  async delete(trx, stacks: Stack[]) {
    const {stackIds, groupIds} = stacks.reduce(
      (map: {stackIds: number[], groupIds: number[]}, stack) => {
        map.stackIds.push(stack.id as number);
        map.groupIds.push(...(stack.groups.map(group => group.id) as number[]));
        return map;
      },
      {stackIds: [], groupIds: []}
    );
    await db('servers_stacks')
      .transacting(trx)
      .whereIn('stack_id', stackIds)
      .del();
    await db('groups_servers')
      .transacting(trx)
      .whereIn('group_id', groupIds)
      .del();
    await db('groups')
      .transacting(trx)
      .whereIn('stack_id', stackIds)
      .del();
    await db('stacks')
      .transacting(trx)
      .whereIn('id', stackIds)
      .del();
  }
};

export default mapper;
