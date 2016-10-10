import {ReflectiveInjector} from 'angular2-di';
import {Session} from 'junction-orm/lib/startSession';
import DeployService from '../application/DeployService';
import ServerService from '../application/ServerService';
import StackService from '../application/StackService';
import UserService from '../application/UserService';
import DeployRepository from '../domain/deploy/DeployRepository';
import ServerRepository from '../domain/server/ServerRepository';
import StackRepository from '../domain/stack/StackRepository';
import UserRepository from '../domain/user/UserRepository';

function provideInjector(req, res, next) {
  req.injector = ReflectiveInjector.resolveAndCreate([
    {provide: Session, useValue: req.junction},
    DeployService,
    ServerService,
    StackService,
    UserService,
    DeployRepository,
    ServerRepository,
    StackRepository,
    UserRepository
  ]);
  next();
}

export default provideInjector;
