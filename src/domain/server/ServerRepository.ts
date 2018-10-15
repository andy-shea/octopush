import autobind from 'autobind-decorator';
import db from '~/persistence';
import NotFoundError from '../NotFoundError';
import Repository from '../Repository';
import Server from './Server';

const baseFindQuery = db('servers').select('servers.id', 'hostname');

interface ServersMap {
  [stackId: number]: Server[];
}

class ServerRepository extends Repository {

  @autobind
  __restore(serverData: any) {
    if (!serverData) throw new NotFoundError('No server found');
    if (this.session.has('Server', serverData.id)) {
      return this.session.retrieve('Server', serverData.id) as Server;
    }
    const server = new Server(serverData.hostname);
    server.id = serverData.id;
    return this.session ? this.session.track(server) as Server : server;
  }

  async findById(id: number) {
    const serverData = await baseFindQuery
      .clone()
      .where({id})
      .first();
    return this.__restore(serverData);
  }

  findByCriteria(criteria = {}, sort = 'hostname') {
    return baseFindQuery
      .clone()
      .where(criteria)
      .orderBy(sort)
      .map(this.__restore);
  }

  findByIds(ids: number[]) {
    return baseFindQuery
      .clone()
      .where('id', 'in', ids)
      .map(this.__restore);
  }

  findByStackId(id: number) {
    const query = baseFindQuery
      .clone()
      .innerJoin('servers_stacks', 'servers.id', 'server_id')
      .where({stack_id: id});
    return query.map(this.__restore);
  }

  findByStackSlug(slug: string) {
    const query = baseFindQuery
      .clone()
      .innerJoin('servers_stacks', 'servers.id', 'server_id')
      .innerJoin('stacks', 'stack_id', 'stacks.id')
      .where({slug});
    return query.map(this.__restore);
  }

  async findByStacks({ids, criteria = {}}: {ids?: number[], criteria?: object}) {
    const query = baseFindQuery
      .clone()
      .select('stack_id')
      .innerJoin('servers_stacks', 'servers.id', 'server_id');
    if (ids) query.where('stack_id', 'in', ids);
    else query.innerJoin('stacks', 'stack_id', 'stacks.id').where(criteria);

    const serversData = await query;
    return serversData.reduce((serversMap: ServersMap, serverData: any) => {
      if (!serversMap[serverData.stack_id]) serversMap[serverData.stack_id] = [];
      serversMap[serverData.stack_id].push(this.__restore(serverData));
      return serversMap;
    }, {});
  }

}

export default ServerRepository;
