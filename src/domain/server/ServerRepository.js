import autobind from 'autobind-decorator';
import {Injectable} from 'angular2-di';
import {Session} from 'junction-orm/lib/startSession';
import Repository from '../Repository';
import NotFoundError from '../NotFoundError';
import Server from './Server';
import db from '~/persistence';

const baseFindQuery = db('servers').select('servers.id', 'hostname');

@Injectable()
class ServerRepository extends Repository {

  constructor(session: Session) {
    super();
    this.session = session;
  }

  @autobind
  __restore(serverData) {
    if (!serverData) throw new NotFoundError('No server found');
    if (this.session.has('Server', serverData.id)) return this.session.retrieve('Server', serverData.id);
    const server = new Server(serverData.hostname);
    server.id = serverData.id;
    return this.session ? this.session.track(server) : server;
  }

  findById(id) {
    return baseFindQuery.clone().where({id}).first().then(this.__restore);
  }

  findByCriteria(criteria = {}, sort = 'hostname') {
    return baseFindQuery.clone().where(criteria).orderBy(sort).map(this.__restore);
  }

  findByIds(ids) {
    return baseFindQuery.clone().where('id', 'in', ids).map(this.__restore);
  }

  findByStack(stack) {
    return baseFindQuery.clone()
        .innerJoin('servers_stacks', 'servers.id', 'server_id')
        .where({stack_id: stack.id})
        .map(this.__restore);
  }

  findByStacks(stacks) {
    const query = baseFindQuery.clone()
        .select('stack_id')
        .innerJoin('servers_stacks', 'servers.id', 'server_id')
        .where('stack_id', 'in', stacks.map(stack => stack.id));
    return query.then(serversData => {
      return serversData.reduce((serversMap, serverData) => {
        if (!serversMap[serverData.stack_id]) serversMap[serverData.stack_id] = [];
        serversMap[serverData.stack_id].push(this.__restore(serverData));
        return serversMap;
      }, {});
    });
  }

}

export default ServerRepository;
