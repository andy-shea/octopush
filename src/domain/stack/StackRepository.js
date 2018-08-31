import autobind from 'autobind-decorator';
import {Injectable} from 'angular2-di';
import {all} from 'awaity/esm';
import {Session} from 'junction-orm/lib/startSession';
import Repository from '../Repository';
import NotFoundError from '../NotFoundError';
import Stack from './Stack';
import Group from './Group';
import ServerRepository from '../server/ServerRepository';
import db from '~/persistence';

function restore(stackData) {
  const stack = new Stack(stackData.title, stackData.git_path);
  stack.id = stackData.id;
  if (stackData.diff) stack.diff = stackData.diff;
  stack.groups = stackData.groups
    ? stackData.groups.map(groupData => {
      const group = new Group(groupData.name, groupData.servers);
      group.id = groupData.id;
      return group;
    })
    : [];
  return stack;
}

function restoreGroups(stack) {
  stack.groups.forEach(group => {
    group.servers = group.servers.map(serverId =>
      stack.servers.find(server => server.id === serverId)
    );
  });
}

const groups = db
  .raw(
    'CASE WHEN COUNT(groups_servers) = 0 THEN NULL ELSE array_to_json(array_agg(row_to_json(groups_servers))) END'
  )
  .wrap('(', ') groups');
const join = `
  LEFT OUTER JOIN (
    SELECT groups.*, array_agg(server_id) AS "servers"
    FROM groups INNER JOIN groups_servers ON (group_id = groups.id)
    GROUP BY groups.id
  ) groups_servers ON (stacks.id = stack_id)
`;
const baseFindQuery = db('stacks')
  .select('stacks.*', groups)
  .joinRaw(join)
  .groupBy('stacks.id');

@Injectable()
class StackRepository extends Repository {

  constructor(session: Session, serverRepository: ServerRepository) {
    super();
    this.session = session;
    this.serverRepository = serverRepository;
  }

  @autobind
  __restore(stackData, servers) {
    if (!stackData) throw new NotFoundError('No stack found');
    if (this.session.has('Stack', stackData.id)) {
      return this.session.retrieve('Stack', stackData.id);
    }
    const stack = restore(stackData);
    stack.servers = servers;
    restoreGroups(stack);
    return this.session ? this.session.track(stack) : stack;
  }

  @autobind
  __restoreAll(stacksData, serversMap) {
    return stacksData.map(stackData => {
      if (this.session.has('Stack', stackData.id)) {
        return this.session.retrieve('Stack', stackData.id);
      }

      const stack = restore(stackData);
      if (serversMap[stack.id]) {
        stack.servers = serversMap[stack.id];
        restoreGroups(stack);
      }
      return this.session ? this.session.track(stack) : stack;
    });
  }

  async findById(id) {
    const getStack = baseFindQuery
      .clone()
      .where({['stacks.id']: id})
      .first();
    const getServers = this.serverRepository.findByStack({id});
    const [stackData, servers] = await all([getStack, getServers]);
    return this.__restore(stackData, servers);
  }

  async findByCriteria(criteria = {}, sort = 'title') {
    const getStacks = baseFindQuery
      .clone()
      .where(criteria)
      .orderBy(sort);
    const getServersMap = this.serverRepository.findByStacks({criteria});
    const [stacksData, serversMap] = await all([getStacks, getServersMap]);
    return this.__restoreAll(stacksData, serversMap);
  }

  async findByIds(ids) {
    const getStacks = baseFindQuery.clone().where('stacks.id', 'in', ids);
    const getServersMap = this.serverRepository.findByStacks({ids});
    const [stacksData, serversMap] = await all([getStacks, getServersMap]);
    return this.__restoreAll(stacksData, serversMap);
  }

  async findBySlug(slug) {
    const getStack = baseFindQuery
      .clone()
      .where({slug})
      .first();
    const getServers = this.serverRepository.findByStack({slug});
    const [stackData, servers] = await all([getStack, getServers]);
    return this.__restore(stackData, servers);
  }

}

export default StackRepository;
