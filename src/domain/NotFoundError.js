import util from 'util';

function NotFoundError(message = '') {
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
  this.message = message;
}

util.inherits(NotFoundError, Error);

export default NotFoundError;
