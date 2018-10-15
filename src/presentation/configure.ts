import {all} from 'awaity/esm';
import {Request, Router} from 'express';
import {configureApp, configurePassport} from 'express-passport-security';
import ServerService from '~/application/ServerService';
import StackService from '~/application/StackService';
import User from '~/domain/user/User';
import UserRepository from '~/domain/user/UserRepository';

function configure(app: Router) {
  app.use((req, res, next) => {
    const userRepository = req.injector.get(UserRepository);
    configurePassport(
      userRepository.findByEmail.bind(userRepository),
      userRepository.findById.bind(userRepository)
    );
    next();
  });

  configureApp(app, {
    async loadInitialData(user: User, req: Request) {
      const stackService = req.injector.get(StackService);
      const serverService = req.injector.get(ServerService);
      const [stacks, servers] = await all([stackService.loadStacks(), serverService.loadServers()]);
      return {stacks, servers};
    }
  });
}

export default configure;
