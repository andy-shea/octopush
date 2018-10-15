import autobind from 'autobind-decorator';
import {all} from 'awaity/esm';
import Session from 'junction-orm/lib/Session';
import db from '~/persistence';
import NotFoundError from '../NotFoundError';
import Repository from '../Repository';
import Stack from '../stack/Stack';
import StackRepository from '../stack/StackRepository';
import UserRepository from '../user/UserRepository';
import Deploy from './Deploy';

const DEPLOYS_PER_PAGE = 10;
const {schema: {timestampable}} = Deploy;

interface UserData {
  user_id: number;
  name: string;
  email: string;
}

function extractUserData({user_id: id, name, email}: UserData) {
  return {id, name, email};
}

function restore(deployData: any) {
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

class DeployRepository extends Repository {

  constructor(
    session: Session,
    private userRepository: UserRepository,
    private stackRepository: StackRepository
  ) {
    super(session);
    this.userRepository = userRepository;
    this.stackRepository = stackRepository;
  }

  @autobind
  async __restore(deployData: any) {
    if (!deployData) throw new NotFoundError('No deploy found');
    if (this.session.has('Deploy', deployData.id)) {
      return this.session.retrieve('Deploy', deployData.id) as Deploy;
    }
    const deploy = restore(deployData);
    deploy.user = this.userRepository.__restore(extractUserData(deployData));
    const stack = await this.stackRepository.findById(deployData.stack_id);
    deploy.stack = stack;
    return this.session ? this.session.track(deploy) as Deploy : deploy as Deploy;
  }

  @autobind
  __restoreAll(stack: Stack, deploysData: any[]) {
    return deploysData.map((deployData: any) => {
      if (this.session.has('Deploy', deployData.id)) {
        return this.session.retrieve('Deploy', deployData.id);
      }
      const deploy = restore(deployData);
      deploy.user = this.userRepository.__restore(extractUserData(deployData));
      deploy.stack = stack;
      return this.session ? this.session.track(deploy) : deploy;
    });
  }

  async paginateByStack(stack: Stack, page: number) {
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

  async findById(id: number) {
    const deployData = await baseFindQuery
      .clone()
      .where({['deploys.id']: id})
      .first();
    return this.__restore(deployData);
  }

}

export default DeployRepository;
