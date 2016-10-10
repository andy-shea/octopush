import logger from './logger';

let socket;

export function configure(server) {
  socket = require('socket.io')(server);
  socket.on('connection', conn => {
    logger.info(`Socket connection from ${conn.handshake.headers.host}`);
  });
}

export function io() {
  return socket;
}

export default {configure, io};
