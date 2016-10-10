import express from 'express';
import {middleware} from 'express-passport-security';
import deploysRouter from './deploys';
import stacksRouter from './stacks';
import serversRouter from './servers';

function createRouter() {
  const router = express.Router();
  router.use(middleware());
  router.use('/deploys', deploysRouter);
  router.use('/stacks', stacksRouter);
  router.use('/servers', serversRouter);
  return router;
}

export default createRouter;
