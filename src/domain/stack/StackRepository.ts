import autobind from 'autobind-decorator';
import {all} from 'awaity/esm';
import Session from 'junction-orm/lib/Session';
import db from '~/persistence';
import NotFoundError from '../NotFoundError';
import Repository from '../Repository';
import Server from '../server/Server';
import ServerRepository from '../server/ServerRepository';
import Group from './Group';
import Stack from './Stack';

function restore(stackData: any) {
  const stack = new Stack(stackData.title, stackData.git_path);
  stack.id = stackData.id;
  if (stackData.diff) stack.diff = stackData.diff;
  return stack;
}

function restoreGroups(stack: Stack, groupsData?: any[]) {
  stack.groups = groupsData
    ? groupsData.map(groupData => {
        const servers = groupData.servers.map((serverId: number) =>
          stack.servers.find(server => server.id === serverId)
        );
        const group = new Group(groupData.name, servers);
        group.id = groupData.id;
        return group;
      })
    : [];
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

interface ServersMap {
  [id: number]: Server[];
}

class StackRepository extends Repository {

  constructor(session: Session, private serverRepository: ServerRepository) {
    super(session);
    this.serverRepository = serverRepository;
  }

  @autobind
  __restore(stackData: any, servers: Server[]) {
    if (!stackData) throw new NotFoundError('No stack found');
    if (this.session.has('Stack', stackData.id)) {
      return this.session.retrieve('Stack', stackData.id) as Stack;
    }
    const stack = restore(stackData);
    stack.servers = servers;
    restoreGroups(stack, stackData.groups);
    return this.session ? this.session.track(stack) as Stack : stack as Stack;
  }

  @autobind
  __restoreAll(stacksData: any[], serversMap: ServersMap) {
    return stacksData.map((stackData) => {
      if (this.session.has('Stack', stackData.id)) {
        return this.session.retrieve('Stack', stackData.id) as Stack;
      }

      const stack = restore(stackData);
      if (serversMap[stack.id as number]) {
        stack.servers = serversMap[stack.id as number];
        restoreGroups(stack, stackData.groups);
      }
      return this.session ? this.session.track(stack) as Stack : stack as Stack;
    });
  }

  async findById(id: number) {
    const getStack = baseFindQuery
      .clone()
      .where({['stacks.id']: id})
      .first();
    const getServers = this.serverRepository.findByStackId(id);
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

  async findByIds(ids: number[]) {
    const getStacks = baseFindQuery.clone().where('stacks.id', 'in', ids);
    const getServersMap = this.serverRepository.findByStacks({ids});
    const [stacksData, serversMap] = await all([getStacks, getServersMap]);
    return this.__restoreAll(stacksData, serversMap);
  }

  async findBySlug(slug: string) {
    const getStack = baseFindQuery
      .clone()
      .where({slug})
      .first();
    const getServers = this.serverRepository.findByStackSlug(slug);
    const [stackData, servers] = await all([getStack, getServers]);
    return this.__restore(stackData, servers);
  }

}

export default StackRepository;
