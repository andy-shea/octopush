require('reflect-metadata');
const express = require('express');
const createApiRouter = require('./api').default;
const body = require('body-parser');
const helmet = require('helmet');
const {junctionProvider, junctionFlush} = require('junction-express-middleware');
const configure = require('./configure').default;
const middleware = require('./middleware').default;
const provideInjector = require('./injector').default;
const session = require('./session').default;
const em = require('../domain/entityManager').default;
const error = require('./error').default;
require('../infrastructure/plugins');

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


module.exports = serverMiddleware;
