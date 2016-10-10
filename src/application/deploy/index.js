import fs from 'fs';
import path from 'path';
import cp from 'child_process';
import config from 'config';
import s from 'string';
import mkdirp from 'mkdirp';
import eventEmitter from '~/infrastructure/events';
import db from '~/persistence';
import mapper from '~/persistence/mapper/deploys';

export function startDeploy(deploy, expandedTargets, emitLine) {
  const {stack, branch, user} = deploy;
  const slugPath = s(stack.slug).underscore().s;
  const branchPath = s(branch).slugify().underscore().s;
  const logPath = path.join(__dirname, '../../..', config.log.deploy_path, slugPath);
  const logFilename = [new Date().toISOString(), branchPath, s(user.name).slugify().underscore().s].join('_');
  mkdirp.sync(logPath);
  deploy.logFile = path.join(slugPath, logFilename);
  const stream = fs.createWriteStream(path.join(logPath, logFilename));

  stream.once('open', function openStream() {
    const child = cp.fork(path.join(__dirname, 'dummy'));
    child.on('message', line => {
      if (line.indexOf('{{{octopush}}}') !== -1) deploy.hosts = JSON.parse(line).data;
      else {
        stream.write(line);
        emitLine(deploy, line);
      }
    });
    child.on('exit', () => {
      stream.end();
      db.transaction(trx => mapper.updateDeploy(trx, deploy, ['hosts'])).then(() => {
        eventEmitter.emit('octopush:deploy', {stack, deploy, hosts: expandedTargets});
        return null;
      }).catch(err => {
        emitLine(stack, deploy, `\u001b[97;41m${err}\u001b[0m`);
      });
    });
    child.send(JSON.stringify(deploy));
  });
}
