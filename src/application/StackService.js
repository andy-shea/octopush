import config from 'config';
import Promise from 'bluebird';
import {Injectable} from 'angular2-di';
import Stack from '~/domain/stack/Stack';
import Group from '~/domain/stack/Group';
import StackRepository from '~/domain/stack/StackRepository';
import ServerRepository from '~/domain/server/ServerRepository';

@Injectable()
class StackService {

  constructor(stackRepo: StackRepository, serverRepo: ServerRepository) {
    this.stackRepo = stackRepo;
    this.serverRepo = serverRepo;
  }

  retrieveStack(slug) {
    return this.stackRepo.findBySlug(slug || config.defaultSlug);
  }

  loadStacks() {
    return this.stackRepo.findByCriteria();
  }

  addStack(title, gitPath, serverIds, diff) {
    const stack = new Stack(title, gitPath);
    if (diff) stack.diff = diff;
    return this.serverRepo.findByIds(serverIds).then(servers => {
      stack.servers = servers;
      this.stackRepo.add(stack);
      return stack;
    });
  }

  updateStack(slug, title, gitPath, serverIds, diff) {
    return Promise.all([this.stackRepo.findBySlug(slug), this.serverRepo.findByIds(serverIds.filter(id => !!id))]).then(([stack, servers]) => {
      stack.title = title;
      stack.gitPath = gitPath;
      stack.diff = diff;

      stack.servers.forEach((server, index) => {
        if (servers.indexOf(server) === -1) {
          stack.servers.splice(index, 1);
          const deletedGroups = stack.groups.reduce((groups, group, groupIndex) => {
            const serverIndex = group.servers.indexOf(server);
            if (serverIndex !== -1) {
              group.servers.splice(serverIndex, 1);
              if (!group.servers.length) groups.push(groupIndex);
            }
            return groups;
          }, []);
          deletedGroups.forEach(deletedIndex => stack.groups.splice(deletedIndex, 1));
        }
      });

      servers.forEach(server => {
        if (stack.servers.indexOf(server) === -1) stack.servers.push(server);
      });

      return stack;
    });
  }

  removeStack(slug) {
    const {stackRepo} = this;
    return stackRepo.findBySlug(slug).then(stackRepo.remove.bind(stackRepo));
  }

  addGroup(slug, name, serverIds) {
    return Promise.all([this.stackRepo.findBySlug(slug), this.serverRepo.findByIds(serverIds)]).then(([stack, servers]) => {
      stack.groups.push(new Group(name, servers));
      return stack;
    });
  }

  updateGroup(slug, groupId, name, serverIds) {
    return Promise.all([this.stackRepo.findBySlug(slug), this.serverRepo.findByIds(serverIds)]).then(([stack, servers]) => {
      const group = stack.groups.find(grp => grp.id == groupId); // eslint-disable-line eqeqeq
      group.name = name;
      group.servers.forEach((server, index) => {
        if (servers.indexOf(server) === -1) group.servers.splice(index, 1);
      });
      servers.forEach(server => {
        if (group.servers.indexOf(server) === -1) group.servers.push(server);
      });
      return stack;
    });
  }

  removeGroup(slug, groupId) {
    return this.stackRepo.findBySlug(slug).then(stack => {
      stack.groups.forEach((group, index) => {
        if (group.id == groupId) stack.groups.splice(index, 1);  // eslint-disable-line eqeqeq
      });
      return stack;
    });
  }

}

export default StackService;
