const logger = require('./logger');
const socketio = require('socket.io');

function configureSocket(server) {
  socket = socketio(server);
  socket.on('connection', conn => {
    logger.info(`Socket connection from ${conn.handshake.headers.host}`);
  });
  return socket;
}

module.exports = configureSocket;
