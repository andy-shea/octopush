const path = require('path');
const config = require('config');
const {createConfig, addPlugins, customConfig, entryPoint, env, setOutput, sourceMaps, webpack} = require('@webpack-blocks/webpack2');
const {common, ROOT_PATH} = require('./blocks/common');
const name = require('./blocks/name');
const node = require('./blocks/node');
const image = require('./blocks/image');
const favicon = require('./blocks/favicon');
const babel = require('./blocks/babel');
const postCss = require('./blocks/postcss');

const development = [
  entryPoint([path.resolve(ROOT_PATH, 'src', 'presentation', 'server')]),
  setOutput({path: path.resolve(ROOT_PATH, 'build'), libraryTarget: 'commonjs2'}),
  favicon(),
  sourceMaps()
];

const production = [
  entryPoint({server: [path.resolve(ROOT_PATH, 'src')]}),
  setOutput({path: path.resolve(ROOT_PATH, 'dist')}),
  favicon('./web/'),
  sourceMaps('source-map')
];

module.exports = createConfig.vanilla([
  entryPoint(['babel-polyfill']),
  name('server'),
  common,
  setOutput({filename: 'server.js'}),
  node(),
  babel(),
  addPlugins([
    new webpack.BannerPlugin({
      banner: "var promise = require('bluebird');require('babel-runtime/core-js/promise').default = promise;promise.onPossiblyUnhandledRejection(function(error) {throw error});",
      raw: true,
      entryOnly: true
    })
  ]),
  image(false),
  customConfig({
    module: {
      rules: [
        {test: /\.css$/, include: /node_modules/, loader: 'css-loader'},
        {test: /\.svg$/, exclude: [/node_modules/, /ui\/favicons/], loader: 'raw-loader'},
      ]
    }
  }),
  postCss(false, true),
  env('development', development),
  env('production', production)
]);
