import express from 'express';
import {setData} from 'junction-express-middleware';
import {HttpError} from 'react-cornerstone';
import ServerService from '~/application/ServerService';
import StackRepository from '~/domain/stack/StackRepository';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const service = req.injector.get(ServerService);
  try {
    const data = await service.loadServers();
    setData(res, next, data);
  }
  catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const service = req.injector.get(ServerService);
  const {
    body: {hostname}
  } = req;
  if (!hostname) return next(HttpError.badRequest('Missing server hostname'));

  try {
    const data = await service.addServer(hostname);
    setData(res, next, data, 201);
  }
  catch (error) {
    next(error);
  }
});

router.post('/:id', async (req, res, next) => {
  const service = req.injector.get(ServerService);
  const {
    body: {newHostname}
  } = req;
  if (!newHostname) return next(HttpError.badRequest('Missing server hostname'));

  try {
    const data = await service.updateServer(req.params.id, newHostname);
    setData(res, next, data);
  }
  catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const service = req.injector.get(ServerService);
  try {
    const stackIds = await service.removeServer(req.params.id);
    setData(res, next, () => req.injector.get(StackRepository).findByIds(stackIds));
  }
  catch (error) {
    next(error);
  }
});

export default router;
