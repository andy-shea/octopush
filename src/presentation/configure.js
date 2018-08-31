import {all} from 'awaity/esm';
import {configureApp, configurePassport} from 'express-passport-security';
import StackService from '~/application/StackService';
import ServerService from '~/application/ServerService';
import UserRepository from '~/domain/user/UserRepository';

function configure(app) {
  app.use((req, res, next) => {
    const userRepository = req.injector.get(UserRepository);
    configurePassport(
      userRepository.findByEmail.bind(userRepository),
      userRepository.findById.bind(userRepository)
    );
    next();
  });

  configureApp(app, {
    async loadInitialData(user, req) {
      const stackService = req.injector.get(StackService);
      const serverService = req.injector.get(ServerService);
      const [stacks, servers] = await all([stackService.loadStacks(), serverService.loadServers()]);
      return {stacks, servers};
    }
  });
}

export default configure;
