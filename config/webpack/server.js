const path = require('path');
const {
  setMode,
  createConfig,
  customConfig,
  entryPoint,
  env,
  setOutput,
  sourceMaps
} = require('@webpack-blocks/webpack');
const {common, ROOT_PATH} = require('./blocks/common');
const name = require('./blocks/name');
const node = require('./blocks/node');
const image = require('./blocks/image');
const favicon = require('./blocks/favicon');
const babel = require('./blocks/babel');

const development = [
  setMode('development'),
  entryPoint(['@babel/polyfill', path.resolve(ROOT_PATH, 'src', 'presentation', 'server')]),
  setOutput({path: path.resolve(ROOT_PATH, 'build'), libraryTarget: 'commonjs2'}),
  favicon(),
  sourceMaps()
];

const production = [
  setMode('production'),
  entryPoint(['@babel/polyfill', path.resolve(ROOT_PATH, 'src')]),
  setOutput({path: path.resolve(ROOT_PATH, 'dist')}),
  favicon('./web/'),
  sourceMaps('source-map')
];

module.exports = createConfig([
  name('server'),
  common,
  setOutput({filename: 'server.js'}),
  node(),
  babel(),
  image(false),
  customConfig({
    module: {
      rules: [{test: /\.css$/, include: /node_modules/, loader: 'css-loader'}]
    }
  }),
  env('development', development),
  env('production', production)
]);
