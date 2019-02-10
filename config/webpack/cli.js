const path = require('path');
const glob = require('glob');
const {
  addPlugins,
  setMode,
  createConfig,
  entryPoint,
  setOutput
} = require('@webpack-blocks/webpack');
const {common, ROOT_PATH} = require('./blocks/common');
const name = require('./blocks/name');
const node = require('./blocks/node');
const babel = require('./blocks/babel');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const pathPrefix = 'src/presentation/cli/commands/';
const entryPoints = glob.sync(`${pathPrefix}**/*.js`).reduce((entryPoints, commandPath) => {
  entryPoints[commandPath.replace(pathPrefix, '').replace('.js', '')] = [
    '@babel/polyfill',
    path.resolve(ROOT_PATH, commandPath)
  ];
  return entryPoints;
}, {});
const outputDir = process.env.NODE_ENV === 'production' ? 'dist' : 'build';

module.exports = createConfig([
  setMode(process.env.NODE_ENV),
  name('cli'),
  common,
  setOutput({
    path: path.resolve(ROOT_PATH, outputDir, 'cli', 'commands'),
    libraryTarget: 'commonjs2',
    filename: '[name].js'
  }),
  node(),
  babel(),
  entryPoint(entryPoints),
  addPlugins([
    new CopyWebpackPlugin([
      {from: 'src/presentation/cli/index.js', to: path.resolve(ROOT_PATH, outputDir, 'cli')}
    ])
  ])
]);
