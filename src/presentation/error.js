import {HttpError} from 'react-cornerstone';
import logger from '~/infrastructure/logger';
import {renderError} from './frontend/template';

function error(err, req, res, next) {
  res.format({
    html: () => {
      if (err instanceof HttpError) {
        if (err.code >= 500) logger.error(err);
        res.status(err.code).send(renderError(err.code, err));
      }
      logger.error(err);
      res.status(500).send(renderError(500, err));
    },

    json: () => {
      const code = (err instanceof HttpError) ? err.code : 500;
      if (code >= 500) logger.error(err);
      res.status(code);
      res.json({message: err.message, code});
    }
  });

  next(err);
}

export default error;
