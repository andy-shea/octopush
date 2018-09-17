import {all} from 'awaity/esm';
import config from 'config';
import Server from '~/domain/server/Server';
import ServerRepository from '~/domain/server/ServerRepository';
import Group from '~/domain/stack/Group';
import Stack from '~/domain/stack/Stack';
import StackRepository from '~/domain/stack/StackRepository';

class StackService {

  constructor(private stackRepo: StackRepository, private serverRepo: ServerRepository) {
    this.stackRepo = stackRepo;
    this.serverRepo = serverRepo;
  }

  retrieveStack(slug: string) {
    return this.stackRepo.findBySlug(slug || config.get('defaultSlug'));
  }

  loadStacks() {
    return this.stackRepo.findByCriteria();
  }

  async addStack(title: string, gitPath: string, serverIds: number[], diff: string) {
    const stack = new Stack(title, gitPath);
    if (diff) stack.diff = diff;
    const servers = await this.serverRepo.findByIds(serverIds);
    stack.servers = servers;
    this.stackRepo.add(stack);
    return stack;
  }

  async updateStack(slug: string, title: string, gitPath: string, serverIds: number[], diff: string) {
    const [stack, servers] = await all([
      this.stackRepo.findBySlug(slug),
      this.serverRepo.findByIds(serverIds.filter(id => !!id))
    ]);
    stack.title = title;
    stack.gitPath = gitPath;
    stack.diff = diff;

    stack.servers.forEach((server: Server, index: number) => {
      if (servers.indexOf(server) === -1) {
        stack.servers.splice(index, 1);
        const deletedGroups = stack.groups.reduce((groups: number[], group: Group, groupIndex: number) => {
          const serverIndex = group.servers.indexOf(server);
          if (serverIndex !== -1) {
            group.servers.splice(serverIndex, 1);
            if (!group.servers.length) groups.push(groupIndex);
          }
          return groups;
        }, []);
        deletedGroups.forEach((deletedIndex: number) => stack.groups.splice(deletedIndex, 1));
      }
    });

    servers.forEach((server: Server) => {
      if (stack.servers.indexOf(server) === -1) stack.servers.push(server);
    });

    return stack;
  }

  async removeStack(slug: string) {
    const stack = await this.stackRepo.findBySlug(slug);
    return this.stackRepo.remove(stack);
  }

  async addGroup(slug: string, name: string, serverIds: number[]) {
    const [stack, servers] = await all([
      this.stackRepo.findBySlug(slug),
      this.serverRepo.findByIds(serverIds)
    ]);
    stack.groups.push(new Group(name, servers));
    return stack;
  }

  async updateGroup(slug: string, groupId: number, name: string, serverIds: number[]) {
    const [stack, servers] = await all([
      this.stackRepo.findBySlug(slug),
      this.serverRepo.findByIds(serverIds)
    ]);
    const group = stack.groups.find((grp: Group) => grp.id === groupId);
    group.name = name;
    group.servers.forEach((server: Server, index: number) => {
      if (servers.indexOf(server) === -1) group.servers.splice(index, 1);
    });
    servers.forEach((server: Server) => {
      if (group.servers.indexOf(server) === -1) group.servers.push(server);
    });
    return stack;
  }

  async removeGroup(slug: string, groupId: number) {
    const stack = await this.stackRepo.findBySlug(slug);
    stack.groups.forEach((group: Group, index: number) => {
      if (group.id === groupId) stack.groups.splice(index, 1);
    });
    return stack;
  }

}

export default StackService;
