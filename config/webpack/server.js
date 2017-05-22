const path = require('path');
const config = require('config');
const {createConfig, addPlugins, customConfig, entryPoint, env, setOutput, sourceMaps, webpack} = require('@webpack-blocks/webpack2');
const {common, ROOT_PATH} = require('./blocks/common');
const node = require('./blocks/node');
const image = require('./blocks/image');
const babel = require('./blocks/babel');
const postCss = require('./blocks/postcss');

const development = [
  setOutput({path: path.resolve(ROOT_PATH, 'build')}),
  sourceMaps()
];

const production = [
  setOutput({path: path.resolve(ROOT_PATH, 'dist')}),
  sourceMaps('source-map')
];

module.exports = createConfig([
  common,
  entryPoint({app: [path.resolve(ROOT_PATH, 'src', 'presentation', 'server')]}),
  node(),
  setOutput({filename: 'server.js'}),
  babel(),
  addPlugins([
    new webpack.BannerPlugin({banner: "require('source-map-support').install();", raw: true, entryOnly: false}),
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
        {test: /\.svg$/, exclude: /node_modules/, loader: 'raw-loader'},
      ]
    }
  }),
  postCss(false, true),
  env('development', development),
  env('production', production)
]);
