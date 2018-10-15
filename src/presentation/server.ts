import body from 'body-parser';
import {Router} from 'express';
import helmet from 'helmet';
import {junctionFlush, junctionProvider} from 'junction-express-middleware';
import 'reflect-metadata';
import em from '../domain/entityManager';
import '../infrastructure/plugins';
import createApiRouter from './api';
import configure from './configure';
import error from './error';
import provideInjector from './injector';
import middleware from './middleware';
import session from './session';

function serverMiddleware() {
  const router = Router();

  router.use(helmet());
  router.use(body.urlencoded({extended: true}));
  router.use(body.json());
  router.use(session);
  router.use(junctionProvider(em));
  router.use(provideInjector);
  configure(router);
  router.use('/api', createApiRouter());
  router.use(junctionFlush);
  router.use(middleware);
  router.use(error);

  return router;
}


export default serverMiddleware;
