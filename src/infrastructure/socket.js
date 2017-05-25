const logger = require('./logger');
const socketio = require('socket.io');

let socket;

function configure(server) {
  socket = socketio(server);
  socket.on('connection', conn => {
    logger.info(`Socket connection from ${conn.handshake.headers.host}`);
  });
}

function io() {
  return socket;
}

exports.configure = configure;
exports.io = io;
