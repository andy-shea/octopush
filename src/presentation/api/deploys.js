import express from 'express';
import {HttpError} from 'react-cornerstone';
import Ansi from 'ansi-to-html';
import s from 'string';
import {setData} from 'junction-express-middleware';
import NotFoundError from '~/domain/NotFoundError';
import DeployService from '~/application/DeployService';
import {types} from '../frontend/deploys/actions';

const convert = new Ansi({newline: true});
const router = express.Router();

const handleError = (next, error) => {
  next(new HttpError(error instanceof NotFoundError ? 404 : 500, error.message));
};

router.get('/:id/log', async (req, res, next) => {
  const {
    params: {id},
    injector
  } = req;
  const service = injector.get(DeployService);

  try {
    const data = await service.loadLog(id);
    setData(res, next)(data);
  }
  catch (error) {
    handleError(next, error);
  }
});

router.get('/:slug?', async (req, res, next) => {
  const {
    params: {slug},
    injector
  } = req;
  const service = injector.get(DeployService);
  const page = req.query.page || 1;

  try {
    const data = await service.loadDeploysAndBranches(slug, page);
    setData(res, next)(data);
  }
  catch (error) {
    handleError(next, error);
  }
});

function emitLine(socket) {
  return (deploy, line) => {
    socket.sockets.emit('octopush.action', {
      type: types.ADD_LOG_LINE,
      payload: {
        deployId: deploy.id,
        line: convert.toHtml(s(line).escapeHTML().s)
      }
    });
  };
}

router.post('/', async (req, res, next) => {
  const {
    user,
    body: {slug, branch, targets},
    injector
  } = req;
  const service = injector.get(DeployService);
  if (!slug) return next(HttpError.badRequest('Missing stack slug'));
  if (!branch) return next(HttpError.badRequest('Missing deploy branch'));
  if (!targets) return next(HttpError.badRequest('Missing deploy targets'));

  try {
    const data = await service.createAndStartDeploy(
      slug,
      branch,
      targets,
      user,
      emitLine(req.app.get('socket'))
    );
    setData(res, next, 201)(data);
  }
  catch (error) {
    handleError(next, error);
  }
});

export default router;
