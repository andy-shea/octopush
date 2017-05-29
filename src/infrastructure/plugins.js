import fs from 'fs';
import path from 'path';
import eventEmitter from './events';

// TODO: find a better way to have plugins play nice with webpack bundling
const req = eval('require'); // eslint-disable-line no-eval
const pluginsPath = path.join(__dirname, '..', '..', 'plugins');
const plugins = fs.readdirSync(pluginsPath).filter(file => fs.statSync(path.join(pluginsPath, file)).isDirectory());
plugins.forEach(file => req('../plugins/' + file + '/index.js')(eventEmitter));
