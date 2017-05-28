import 'reflect-metadata';
import express from 'express';
import createApiRouter from './api';
import body from 'body-parser';
import helmet from 'helmet';
import {junctionProvider, junctionFlush} from 'junction-express-middleware';
import configure from './configure';
import middleware from './middleware';
import provideInjector from './injector';
import session from './session';
import em from '../domain/entityManager';
import error from './error';
import '../infrastructure/plugins';

function serverMiddleware() {
  const router = express.Router();

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
