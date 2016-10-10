import Promise from 'bluebird';
import {Injectable} from 'angular2-di';
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

  addServer(hostname) {
    const server = new Server(hostname);
    this.serverRepo.add(server);
    return Promise.resolve(server);
  }

  updateServer(id, newHostname) {
    return this.serverRepo.findById(id).then(server => {
      server.hostname = newHostname;
      return server;
    });
  }

  removeServer(id) {
    const serverRepo = this.serverRepo;

    const getAffectedStackIds = db.from('servers_stacks').where({server_id: id}).union(function() {
      this.select('stack_id').from('groups_servers').innerJoin('groups', 'group_id', 'groups.id').where({server_id: id});
    }).pluck('stack_id');

    return Promise.all([serverRepo.findById(id), getAffectedStackIds]).then(([server, stackIds]) => {
      serverRepo.remove(server);
      return stackIds;
    });
  }

}

export default ServerService;
