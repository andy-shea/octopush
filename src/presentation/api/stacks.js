import express from 'express';
import {HttpError} from 'react-cornerstone/server';
import {setData, setStatus} from 'junction-express-middleware';
import StackService from '~/application/StackService';

const router = express.Router();

router.get('/', (req, res, next) => {
  const service = req.injector.get(StackService);
  service.loadStacks().then(setData(res, next)).catch(next);
});

router.post('/', (req, res, next) => {
  const service = req.injector.get(StackService);
  const {body: {title, gitPath, serverIds, diff}} = req;
  if (!title) return next(HttpError.badRequest('Missing stack title'));
  if (!gitPath) return next(HttpError.badRequest('Missing stack git path'));
  if (!serverIds) return next(HttpError.badRequest('Missing stack server whitelist'));

  service.addStack(title, gitPath, serverIds, diff || null).then(setData(res, next, 201)).catch(next);
});

router.post('/:slug', (req, res, next) => {
  const service = req.injector.get(StackService);
  const {params: {slug}, body: {title, gitPath, serverIds, diff}} = req;
  if (!title) return next(HttpError.badRequest('Missing stack title'));
  if (!gitPath) return next(HttpError.badRequest('Missing stack git path'));
  if (!serverIds) return next(HttpError.badRequest('Missing stack server whitelist'));

  service.updateStack(slug, title, gitPath, serverIds, diff || null).then(setData(res, next)).catch(next);
});

router.delete('/:slug', (req, res, next) => {
  const service = req.injector.get(StackService);
  service.removeStack(req.params.slug).then(setStatus(res, next)).catch(next);
});

router.post('/:slug/groups', (req, res, next) => {
  const service = req.injector.get(StackService);
  const {params: {slug}, body: {name, serverIds}} = req;
  if (!name) return next(HttpError.badRequest('Missing group name'));
  if (!serverIds) return next(HttpError.badRequest('Missing group server whitelist'));

  service.addGroup(slug, name, serverIds).then(setData(res, next)).catch(next);
});

router.post('/:slug/groups/:groupId', (req, res, next) => {
  const service = req.injector.get(StackService);
  const {params: {slug, groupId}, body: {name, serverIds}} = req;
  if (!name) return next(HttpError.badRequest('Missing group name'));
  if (!serverIds) return next(HttpError.badRequest('Missing group server whitelist'));

  service.updateGroup(slug, groupId, name, serverIds).then(setData(res, next)).catch(next);
});

router.delete('/:slug/groups/:groupId', (req, res, next) => {
  const service = req.injector.get(StackService);
  const {params: {slug, groupId}} = req;
  service.removeGroup(slug, groupId).then(setData(res, next)).catch(next);
});

export default router;
