import {Injector} from '@angular/core';
import Session from 'junction-orm/lib/Session';
import DeployService from '../application/DeployService';
import ServerService from '../application/ServerService';
import StackService from '../application/StackService';
import UserService from '../application/UserService';
import DeployRepository from '../domain/deploy/DeployRepository';
import ServerRepository from '../domain/server/ServerRepository';
import StackRepository from '../domain/stack/StackRepository';
import UserRepository from '../domain/user/UserRepository';

function provideInjector(req, res, next) {
  req.injector = Injector.create([
    {provide: Session, useValue: req.junction},
    {provide: DeployService, deps: [DeployRepository, StackRepository, StackService]},
    {provide: ServerService, deps: [ServerRepository]},
    {provide: StackService, deps: [StackRepository, ServerRepository]},
    {provide: UserService, deps: [UserRepository]},
    {provide: DeployRepository, deps: [Session, UserRepository, StackRepository]},
    {provide: ServerRepository, deps: [Session]},
    {provide: StackRepository, deps: [Session, ServerRepository]},
    {provide: UserRepository, deps: [Session]}
  ]);
  next();
}

export default provideInjector;
