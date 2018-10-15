import Ansi from 'ansi-to-html';
import express, {NextFunction} from 'express';
import {setData} from 'junction-express-middleware';
import {HttpError} from 'react-cornerstone';
import {Server} from 'socket.io';
import s from 'string';
import DeployService from '~/application/DeployService';
import Deploy from '~/domain/deploy/Deploy';
import NotFoundError from '~/domain/NotFoundError';
import {types} from '../frontend/deploys/actions';

const convert = new Ansi({newline: true});
const router = express.Router();

const handleError = (next: NextFunction, error: Error) => {
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
    setData(res, next, data);
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
    setData(res, next, data);
  }
  catch (error) {
    handleError(next, error);
  }
});

function emitLine(socket: Server) {
  return (deploy: Deploy, line: string) => {
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
    setData(res, next, data, 201);
  }
  catch (error) {
    handleError(next, error);
  }
});

export default router;
