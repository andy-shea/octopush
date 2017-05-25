'use strict'; // eslint-disable-line strict

const config = require('config');
const express = require('express');
const http = require('http');
const socket = require('./infrastructure/socket');
const logger = require('./infrastructure/logger');

const app = express();

if (process.env.NODE_ENV === 'development') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');
  const webpackHotServerMiddleware = require('webpack-hot-server-middleware');
  const webpackConfig = require('../webpack.config.js');
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler, {quiet: true}));
  app.use(webpackHotMiddleware(compiler.compilers.find(comp => comp.name === 'client')));
  app.use(webpackHotServerMiddleware(compiler));
}
else app.use(require('./presentation/server').default());

const server = http.createServer(app);
socket.configure(server);
server.listen(config.server.port, config.server.address, () => {
  logger.info(`Frontend server listening on ${server.address().address}:${server.address().port}`);
});
