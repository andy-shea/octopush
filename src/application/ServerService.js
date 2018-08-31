import {Injectable} from 'angular2-di';
import {all} from 'awaity/esm';
import Server from '~/domain/server/Server';
import ServerRepository from '~/domain/server/ServerRepository';
import db from '~/persistence';

@Injectable()
class ServerService {

  constructor(serverRepo: ServerRepository) {
    this.serverRepo = serverRepo;
  }

  loadServers() {
    return this.serverRepo.findByCriteria();
  }

  async addServer(hostname) {
    const server = new Server(hostname);
    this.serverRepo.add(server);
    return Promise.resolve(server);
  }

  async updateServer(id, newHostname) {
    const server = await this.serverRepo.findById(id);
    server.hostname = newHostname;
    return server;
  }

  async removeServer(id) {
    const serverRepo = this.serverRepo;

    const getAffectedStackIds = db
      .from('servers_stacks')
      .where({server_id: id})
      .union(function() {
        this.select('stack_id')
          .from('groups_servers')
          .innerJoin('groups', 'group_id', 'groups.id')
          .where({server_id: id});
      })
      .pluck('stack_id');

    const [server, stackIds] = await all([serverRepo.findById(id), getAffectedStackIds]);
    serverRepo.remove(server);
    return stackIds;
  }

}

export default ServerService;
