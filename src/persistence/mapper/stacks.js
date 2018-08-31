import {all} from 'awaity/esm';
import db from '~/persistence';
import groupMapper from './groups';
import Stack from '~/domain/stack/Stack';
import s from 'string';

function updateStack(stack, trx, props) {
  const {
    schema: {props: schemaProps}
  } = Stack;
  const values = props.reduce((map, prop) => {
    map[schemaProps[prop].column || s(prop).underscore().s] = stack[prop];
    return map;
  }, {});
  values.updated_at = db.fn.now();
  return db('stacks')
    .transacting(trx)
    .where({id: stack.id})
    .update(values);
}

function updateCollections(observer, trx, collections) {
  const mods = [];
  const {
    entity,
    collections: {servers, groups}
  } = observer;
  if (collections.indexOf('servers') !== -1) {
    const {added, removed} = servers.changed();
    if (added.length) mods.push(insertServers(trx, entity, added));
    if (removed.length) mods.push(deleteServers(trx, entity, removed));
  }
  if (collections.indexOf('groups') !== -1) {
    const {added, updated, removed} = groups.changed();
    if (added.length) mods.push(groupMapper.insert(trx, entity, added));
    if (updated.length) mods.push(groupMapper.update(trx, updated));
    if (removed.length) mods.push(groupMapper.delete(trx, removed));
  }
  return mods;
}

function insertServers(trx, stack, servers) {
  const values = servers.map(server => ({server_id: server.id, stack_id: stack.id}));
  return db('servers_stacks')
    .transacting(trx)
    .insert(values);
}

function deleteServers(trx, stack, servers) {
  const serverIds = servers.map(server => server.id);
  return db('servers_stacks')
    .transacting(trx)
    .whereIn('server_id', serverIds)
    .andWhere('stack_id', stack.id)
    .del();
}

const mapper = {
  async insert(trx, stacks) {
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
    return await all(
      ids.map((id, index) => {
        const stack = stacks[index];
        stack.id = id;
        return insertServers(trx, stack, stack.servers);
      })
    );
  },

  update(trx, observers) {
    return Promise.all(
      observers.reduce((mods, observer) => {
        const {entity} = observer;
        const {props, collections} = observer.changed();
        if (props.length) mods.push(updateStack(entity, trx, props));
        if (collections.length) mods.push(...updateCollections(observer, trx, collections));
        return mods;
      }, [])
    );
  },

  async delete(trx, stacks) {
    const {stackIds, groupIds} = stacks.reduce(
      (map, stack) => {
        map.stackIds.push(stack.id);
        map.groupIds.push(...stack.groups.map(group => group.id));
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
