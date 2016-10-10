import 'reflect-metadata';
import config from 'config';
import path from 'path';
import express from 'express';
import http from 'http';
import body from 'body-parser';
import helmet from 'helmet';
import {junctionProvider, junctionFlush} from 'junction-express-middleware';
import configure from './configure';
import initialLoad from './load';
import provideInjector from './injector';
import session from './session';
import createApiRouter from './api';
import em from '../domain/entityManager';
import error from './error';
import socket from '../infrastructure/socket';
import logger from '../infrastructure/logger';

const app = express();

app.use(helmet());
if (process.env.NODE_ENV === 'development') app.use(express.static(path.join(__dirname, '..', '..', 'build', 'web')));
app.use(body.urlencoded({extended: true}));
app.use(body.json());
app.use(session);
app.use(junctionProvider(em));
app.use(provideInjector);
configure(app);
app.use('/api', createApiRouter());
app.use(junctionFlush);
app.use(initialLoad);
app.use(error);

const server = http.createServer(app);
socket.configure(server);
server.listen(config.server.port, config.server.address, () => {
  logger.info(`Frontend server listening on ${server.address().address}:${server.address().port}`);
});
