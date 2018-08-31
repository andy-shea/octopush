import autobind from 'autobind-decorator';
import {Injectable} from 'angular2-di';
import {all} from 'awaity/esm';
import {Session} from 'junction-orm/lib/startSession';
import Repository from '../Repository';
import NotFoundError from '../NotFoundError';
import Deploy from './Deploy';
import UserRepository from '../user/UserRepository';
import StackRepository from '../stack/StackRepository';
import db from '~/persistence';

const DEPLOYS_PER_PAGE = 10;
const {
  schema: {timestampable}
} = Deploy;

function extractUserData({user_id: id, name, email}) {
  return {id, name, email};
}

function restore(deployData) {
  const deploy = new Deploy(deployData.branch, deployData.user_id);
  deploy.id = deployData.id;
  if (deployData.log_file) deploy.logFile = deployData.log_file;
  if (deployData.hosts) deploy.hosts = deployData.hosts;
  if (timestampable) {
    deploy.createdAt = deployData.created_at;
    deploy.updatedAt = deployData.updated_at;
  }
  return deploy;
}

const baseFindQuery = db('deploys')
  .select(
    'deploys.id',
    'branch',
    'log_file',
    'hosts',
    'user_id',
    'stack_id',
    'deploys.created_at',
    'deploys.updated_at',
    'name',
    'email'
  )
  .innerJoin('users', 'user_id', 'users.id');

@Injectable()
class DeployRepository extends Repository {

  constructor(session: Session, userRepository: UserRepository, stackRepository: StackRepository) {
    super();
    this.session = session;
    this.userRepository = userRepository;
    this.stackRepository = stackRepository;
  }

  @autobind
  async __restore(deployData) {
    if (!deployData) throw new NotFoundError('No deploy found');
    if (this.session.has('Deploy', deployData.id)) {
      return this.session.retrieve('Deploy', deployData.id);
    }
    const deploy = restore(deployData);
    deploy.user = this.userRepository.__restore(extractUserData(deployData));
    const stack = await this.stackRepository.findById(deployData.stack_id);
    deploy.stack = stack;
    return this.session ? this.session.track(deploy) : deploy;
  }

  @autobind
  __restoreAll(stack, deploysData) {
    return deploysData.map(deployData => {
      if (this.session.has('Deploy', deployData.id)) {
        return this.session.retrieve('Deploy', deployData.id);
      }
      const deploy = restore(deployData);
      deploy.user = this.userRepository.__restore(extractUserData(deployData));
      deploy.stack = stack;
      return this.session ? this.session.track(deploy) : deploy;
    });
  }

  async paginateByStack(stack, page) {
    const getDeploys = baseFindQuery
      .clone()
      .where({stack_id: stack.id})
      .orderBy('created_at', 'desc')
      .limit(DEPLOYS_PER_PAGE)
      .offset((page - 1) * DEPLOYS_PER_PAGE);
    const getTotalDeploys = db('deploys')
      .where({stack_id: stack.id})
      .count('id')
      .first();

    const [deploysData, {count: total}] = await all([getDeploys, getTotalDeploys]);
    const totalCount = parseInt(total, 10);
    return {
      deploys: this.__restoreAll(stack, deploysData),
      limit: DEPLOYS_PER_PAGE,
      total: totalCount,
      totalPages: Math.ceil(totalCount / DEPLOYS_PER_PAGE),
      page
    };
  }

  async findById(id) {
    const deployData = await baseFindQuery
      .clone()
      .where({['deploys.id']: id})
      .first();
    return this.__restore(deployData);
  }

}

export default DeployRepository;
