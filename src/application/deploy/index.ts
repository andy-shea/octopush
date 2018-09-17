import cp from 'child_process';
import config from 'config';
import fs from 'fs';
import mkdirp from 'mkdirp';
import path from 'path';
import s from 'string';
import Deploy from '~/domain/deploy/Deploy';
import eventEmitter from '~/infrastructure/events';
import db from '~/persistence';
import mapper from '~/persistence/mapper/deploys';

export type EmitLineHandler = (deploy: Deploy, line: string) => void;

export function startDeploy(deploy: Deploy, expandedTargets: string[], emitLine: EmitLineHandler) {
  const {stack, branch, user} = deploy;
  if (!stack) throw new Error('No stack found');
  const slugPath = s(stack.slug).underscore().s;
  const branchPath = s(branch)
    .slugify()
    .underscore().s;
  const logPath = path.join(__dirname, '../../..', config.get('log.deploy_path'), slugPath);
  const logFilename = [
    new Date().toISOString(),
    branchPath,
    s(user.name)
      .slugify()
      .underscore().s
  ].join('_');
  mkdirp.sync(logPath);
  deploy.logFile = path.join(slugPath, logFilename);
  const stream = fs.createWriteStream(path.join(logPath, logFilename));

  stream.once('open', function openStream() {
    const child = cp.fork(path.join(__dirname, 'deploy'));
    child.on('message', async line => {
      if (line.indexOf('{{{octopush}}}') !== -1) {
        deploy.hosts = JSON.parse(line).data;
        try {
          await db.transaction(trx => mapper.updateDeploy(trx, deploy, ['hosts']));
          eventEmitter.emit('octopush:deploy', {stack, deploy, hosts: expandedTargets});
        }
        catch (error) {
          emitLine(deploy, `\u001b[97;41m${error}\u001b[0m`);
        }
      }
      else {
        stream.write(line);
        emitLine(deploy, line);
      }
    });
    child.on('exit', () => stream.end());
    child.send(JSON.stringify({branch, slugPath, branchPath, expandedTargets}));
  });
}
