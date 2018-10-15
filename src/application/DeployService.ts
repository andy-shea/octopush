import Ansi from 'ansi-to-html';
import {all} from 'awaity/esm';
import config from 'config';
import fs from 'fs';
import path from 'path';
import s from 'string';
import Deploy from '~/domain/deploy/Deploy';
import DeployRepository from '~/domain/deploy/DeployRepository';
import Stack from '~/domain/stack/Stack';
import StackRepository from '~/domain/stack/StackRepository';
import User from '~/domain/user/User';
import {EmitLineHandler, startDeploy} from './deploy';
import {getBranches} from './deploy/branch';
import StackService from './StackService';

const convert = new Ansi({newline: true});

function expandTargets(stack: Stack, targets: string[]) {
  const groupTargets = stack.groups
    .filter(group => targets.indexOf(group.name) !== -1)
    .reduce((expandedTargets: string[], group) => {
      return expandedTargets.concat(group.servers.map(server => server.hostname));
    }, []);
  return Array.from(
    new Set(targets.filter(target => target.indexOf('.') !== -1).concat(groupTargets))
  );
}

class DeployService {

  constructor(
      private deployRepo: DeployRepository,
      private stackRepo: StackRepository,
      private stackService: StackService
  ) {
    this.deployRepo = deployRepo;
    this.stackRepo = stackRepo;
    this.stackService = stackService;
  }

  async loadDeploysAndBranches(slug: string, page: number) {
    const stack = await this.stackService.retrieveStack(slug || '');
    const [pagination, branches] = await all([
      this.deployRepo.paginateByStack(stack, page),
      getBranches(stack)
    ]);
    return {slug: stack.slug, pagination, branches};
  }

  async createAndStartDeploy(slug: string, branch: string, targets: string[], user: User, emitLine: EmitLineHandler) {
    const stack = await this.stackRepo.findBySlug(slug);
    const expandedTargets = expandTargets(stack, targets);
    const deploy = new Deploy(branch, user, stack);
    deploy.createdAt = new Date();
    deploy.hosts = expandedTargets.map(name => ({name}));
    this.deployRepo.add(deploy);
    startDeploy(deploy, expandedTargets, emitLine);
    return deploy;
  }

  async loadLog(id: number) {
    const deploy = await this.deployRepo.findById(id);
    if (!deploy.logFile) throw new Error('No log file found');
    const rawLog = fs
      .readFileSync(path.join(__dirname, '../..', config.get('log.deploy_path'), deploy.logFile), {
        encoding: 'utf-8'
      })
      .toString();
    return convert.toHtml(s(rawLog).escapeHTML().s);
  }

}

export default DeployService;
