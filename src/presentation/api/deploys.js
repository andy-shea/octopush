import express from 'express';
import {HttpError} from 'react-cornerstone/server';
import Ansi from 'ansi-to-html';
import s from 'string';
import {setData} from 'junction-express-middleware';
import NotFoundError from '~/domain/NotFoundError';
import socket from '~/infrastructure/socket';
import DeployService from '~/application/DeployService';
import {types} from '../frontend/deploys/actions';

const convert = new Ansi({newline: true});
const router = express.Router();

const handleError = (req, res, next) => err => {
  next(new HttpError(err instanceof NotFoundError ? 404 : 500, err.message));
};

router.get('/:id/log', (req, res, next) => {
  const {params: {id}, injector} = req;
  const service = injector.get(DeployService);
  service.loadLog(id).then(setData(res, next)).catch(handleError(req, res, next));
});

router.get('/:slug?', (req, res, next) => {
  const {params: {slug}, injector} = req;
  const service = injector.get(DeployService);
  const page = req.query.page || 1;
  service.loadDeploysAndBranches(slug, page).then(setData(res, next)).catch(handleError(req, res, next));
});

router.post('/', (req, res, next) => {
  const {user, body: {slug, branch, targets}, injector} = req;
  const service = injector.get(DeployService);
  if (!slug) return next(HttpError.badRequest('Missing stack slug'));
  if (!branch) return next(HttpError.badRequest('Missing deploy branch'));
  if (!targets) return next(HttpError.badRequest('Missing deploy targets'));

  function emitLine(deploy, line) {
    socket.io().sockets.emit('octopush.action', {
      type: types.ADD_LOG_LINE,
      payload: {
        deployId: deploy.id,
        line: convert.toHtml(s(line).escapeHTML().s)
      }
    });
  }

  service.createAndStartDeploy(slug, branch, targets, user, emitLine)
      .then(setData(res, next, 201))
      .catch(handleError(req, res, next));
});

export default router;
