import Promise from 'bluebird';
import {configureApp, configurePassport} from 'express-passport-security';
import StackService from '~/application/StackService';
import ServerService from '~/application/ServerService';
import UserRepository from '~/domain/user/UserRepository';

function configure(app) {
  app.use((req, res, next) => {
    const userRepository = req.injector.get(UserRepository);
    configurePassport(userRepository.findByEmail.bind(userRepository), userRepository.findById.bind(userRepository));
    next();
  });

  configureApp(app, {
    loadInitialData(user, req) {
      const stackService = req.injector.get(StackService);
      const serverService = req.injector.get(ServerService);
      return Promise.all([stackService.loadStacks(), serverService.loadServers()]).then(([stacks, servers]) => ({stacks, servers}));
    }
  });
}

export default configure;
