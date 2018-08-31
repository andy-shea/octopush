import fs from 'fs';
import path from 'path';
import config from 'config';
import Ansi from 'ansi-to-html';
import s from 'string';
import {all} from 'awaity/esm';
import {Injectable} from 'angular2-di';
import DeployRepository from '~/domain/deploy/DeployRepository';
import StackRepository from '~/domain/stack/StackRepository';
import StackService from './StackService';
import Deploy from '~/domain/deploy/Deploy';
import {getBranches} from './deploy/branch';
import {startDeploy} from './deploy';

const convert = new Ansi({newline: true});

function expandTargets(stack, targets) {
  const groupTargets = stack.groups
    .filter(group => targets.indexOf(group.name) !== -1)
    .reduce((expandedTargets, group) => {
      return expandedTargets.concat(group.servers.map(server => server.hostname));
    }, []);
  return Array.from(
    new Set(targets.filter(target => target.indexOf('.') !== -1).concat(groupTargets))
  );
}

@Injectable()
class DeployService {

  constructor(
      deployRepo: DeployRepository,
      stackRepo: StackRepository,
      stackService: StackService
  ) {
    this.deployRepo = deployRepo;
    this.stackRepo = stackRepo;
    this.stackService = stackService;
  }

  async loadDeploysAndBranches(slug, page) {
    const stack = await this.stackService.retrieveStack(slug || '');
    const [pagination, branches] = await all([
      this.deployRepo.paginateByStack(stack, page),
      getBranches(stack)
    ]);
    return {slug: stack.slug, pagination, branches};
  }

  async createAndStartDeploy(slug, branch, targets, user, emitLine) {
    const stack = await this.stackRepo.findBySlug(slug);
    const expandedTargets = expandTargets(stack, targets);
    const deploy = new Deploy(branch, user, stack);
    deploy.createdAt = new Date();
    deploy.hosts = expandedTargets.map(name => ({name}));
    this.deployRepo.add(deploy);
    startDeploy(deploy, expandedTargets, emitLine);
    return deploy;
  }

  async loadLog(id) {
    const deploy = await this.deployRepo.findById(id);
    const rawLog = fs
      .readFileSync(path.join(__dirname, '../..', config.log.deploy_path, deploy.logFile), {
        encoding: 'utf-8'
      })
      .toString();
    return convert.toHtml(s(rawLog).escapeHTML().s);
  }

}

export default DeployService;
