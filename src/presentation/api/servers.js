import express from 'express';
import {HttpError} from 'react-cornerstone/server';
import {setData} from 'junction-express-middleware';
import ServerService from '~/application/ServerService';
import StackRepository from '~/domain/stack/StackRepository';

const router = express.Router();

router.get('/', (req, res, next) => {
  const service = req.injector.get(ServerService);
  service.loadServers().then(setData(res, next)).catch(next);
});

router.post('/', (req, res, next) => {
  const service = req.injector.get(ServerService);
  const {body: {hostname}} = req;
  if (!hostname) return next(HttpError.badRequest('Missing server hostname'));
  service.addServer(hostname).then(setData(res, next, 201)).catch(next);
});

router.post('/:id', (req, res, next) => {
  const service = req.injector.get(ServerService);
  const {body: {newHostname}} = req;
  if (!newHostname) return next(HttpError.badRequest('Missing server hostname'));
  service.updateServer(req.params.id, newHostname).then(setData(res, next)).catch(next);
});

router.delete('/:id', (req, res, next) => {
  const service = req.injector.get(ServerService);
  service.removeServer(req.params.id).then(stackIds => {
    setData(res, next)(() => req.injector.get(StackRepository).findByIds(stackIds));
  }).catch(next);
});

export default router;
