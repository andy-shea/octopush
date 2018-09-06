import express from 'express';
import {HttpError} from 'react-cornerstone';
import {setData, setStatus} from 'junction-express-middleware';
import StackService from '~/application/StackService';

const router = express.Router();

router.get('/', async (req, res, next) => {
  const service = req.injector.get(StackService);
  try {
    const data = await service.loadStacks();
    setData(res, next, data);
  }
  catch (error) {
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const service = req.injector.get(StackService);
  const {
    body: {title, gitPath, serverIds, diff}
  } = req;
  if (!title) return next(HttpError.badRequest('Missing stack title'));
  if (!gitPath) return next(HttpError.badRequest('Missing stack git path'));
  if (!serverIds) return next(HttpError.badRequest('Missing stack server whitelist'));

  try {
    const data = await service.addStack(title, gitPath, serverIds, diff || null);
    setData(res, next, data, 201);
  }
  catch (error) {
    next(error);
  }
});

router.post('/:slug', async (req, res, next) => {
  const service = req.injector.get(StackService);
  const {
    params: {slug},
    body: {title, gitPath, serverIds, diff}
  } = req;
  if (!title) return next(HttpError.badRequest('Missing stack title'));
  if (!gitPath) return next(HttpError.badRequest('Missing stack git path'));
  if (!serverIds) return next(HttpError.badRequest('Missing stack server whitelist'));

  try {
    const data = await service.updateStack(slug, title, gitPath, serverIds, diff || null);
    setData(res, next, data);
  }
  catch (error) {
    next(error);
  }
});

router.delete('/:slug', async (req, res, next) => {
  const service = req.injector.get(StackService);
  try {
    await service.removeStack(req.params.slug);
    setStatus(res, next);
  }
  catch (error) {
    next(error);
  }
});

router.post('/:slug/groups', async (req, res, next) => {
  const service = req.injector.get(StackService);
  const {
    params: {slug},
    body: {name, serverIds}
  } = req;
  if (!name) return next(HttpError.badRequest('Missing group name'));
  if (!serverIds) return next(HttpError.badRequest('Missing group server whitelist'));

  try {
    const data = await service.addGroup(slug, name, serverIds);
    setData(res, next, data);
  }
  catch (error) {
    next(error);
  }
});

router.post('/:slug/groups/:groupId', async (req, res, next) => {
  const service = req.injector.get(StackService);
  const {
    params: {slug, groupId},
    body: {name, serverIds}
  } = req;
  if (!name) return next(HttpError.badRequest('Missing group name'));
  if (!serverIds) return next(HttpError.badRequest('Missing group server whitelist'));

  try {
    const data = await service.updateGroup(slug, groupId, name, serverIds);
    setData(res, next, data);
  }
  catch (error) {
    next(error);
  }
});

router.delete('/:slug/groups/:groupId', async (req, res, next) => {
  const service = req.injector.get(StackService);
  const {
    params: {slug, groupId}
  } = req;

  try {
    const data = await service.removeGroup(slug, groupId);
    setData(res, next, data);
  }
  catch (error) {
    next(error);
  }
});

export default router;
