import {all} from 'awaity/esm';
import Server from '~/domain/server/Server';
import ServerRepository from '~/domain/server/ServerRepository';
import db from '~/persistence';

class ServerService {

  constructor(private serverRepo: ServerRepository) {
    this.serverRepo = serverRepo;
  }

  loadServers() {
    return this.serverRepo.findByCriteria();
  }

  async addServer(hostname: string) {
    const server = new Server(hostname);
    this.serverRepo.add(server);
    return Promise.resolve(server);
  }

  async updateServer(id: number, newHostname: string) {
    const server = await this.serverRepo.findById(id);
    server.hostname = newHostname;
    return server;
  }

  async removeServer(id: number) {
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
