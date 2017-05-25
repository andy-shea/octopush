const bunyan = require('bunyan');
const path = require('path');
const PrettyStream = require('bunyan-prettystream');

const streams = [{
  level: (process.env.NODE_ENV === 'development') ? 'debug' : 'info',
  path: path.join(__dirname, '/../../log/octopush')
}];
if (process.env.NODE_ENV === 'development') {
  const prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);
  streams.push({level: 'debug', type: 'raw', stream: prettyStdOut});
}

module.exports = bunyan.createLogger({name: 'octopush', streams});
