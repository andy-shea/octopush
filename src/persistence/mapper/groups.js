import Promise from 'bluebird';
import db from '~/persistence';
import Group from '~/domain/stack/Group';

function updateGroup(group, trx, props) {
  const {schema: {props: schemaProps}} = Group;
  const values = props.reduce((map, prop) => {
    map[schemaProps[prop].column || prop] = group[prop];
    return map;
  }, {});
  return db('groups').transacting(trx).where({id: group.id}).update(values);
}

function insertServers(trx, group, servers) {
  const values = servers.map(server => ({server_id: server.id, group_id: group.id}));
  return db('groups_servers').transacting(trx).insert(values);
}

function deleteServers(trx, group, servers) {
  const serverIds = servers.map(server => server.id);
  return db('groups_servers').transacting(trx).whereIn('server_id', serverIds).andWhere('group_id', group.id).del();
}

function updateCollections(observer, trx) {
  const mods = [];
  const {entity, collections: {servers: {added, removed}}} = observer;
  if (added.length) mods.push(insertServers(trx, entity, added));
  if (removed.length) mods.push(deleteServers(trx, entity, removed));
  return mods;
}

const mapper = {
  insert(trx, stack, groups) {
    const values = groups.map(group => ({name: group.name, stack_id: stack.id}));
    return db('groups').transacting(trx).insert(values, 'id').then(ids => {
      return Promise.all(ids.map((id, index) => {
        const group = groups[index];
        group.id = id;
        return insertServers(trx, group, group.servers);
      }));
    });
  },

  update(trx, observers) {
    return Promise.all(observers.reduce((mods, observer) => {
      const {entity} = observer;
      const {props, collections} = observer.changed();
      if (props.length) mods.push(updateGroup(entity, trx, props));
      if (collections.length) mods.push(...updateCollections(observer, trx));
      return mods;
    }, []));
  },

  delete(trx, groups) {
    const groupIds = groups.map(group => group.id);
    return db('groups_servers').transacting(trx).whereIn('group_id', groupIds).del()
        .then(() => db('groups').transacting(trx).whereIn('id', groupIds).del());
  }
};

export default mapper;
