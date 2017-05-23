import logger from './logger';
import socketio from 'socket.io';

let socket;

export function configure(server) {
  socket = socketio(server);
  socket.on('connection', conn => {
    logger.info(`Socket connection from ${conn.handshake.headers.host}`);
  });
}

export function io() {
  return socket;
}

export default {configure, io};
