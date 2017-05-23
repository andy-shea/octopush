import bunyan from 'bunyan';
import path from 'path';
import PrettyStream from 'bunyan-prettystream';

const streams = [{
  level: (process.env.NODE_ENV === 'development') ? 'debug' : 'info',
  path: path.join(__dirname, '/../../log/octopush')
}];
if (process.env.NODE_ENV === 'development') {
  const prettyStdOut = new PrettyStream();
  prettyStdOut.pipe(process.stdout);
  streams.push({level: 'debug', type: 'raw', stream: prettyStdOut});
}

const logger = bunyan.createLogger({name: 'octopush', streams});

export default logger;
