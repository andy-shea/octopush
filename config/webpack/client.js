const webpack = require('webpack');
const path = require('path');
const {
  setMode,
  createConfig,
  addPlugins,
  entryPoint,
  env,
  setOutput,
  sourceMaps,
  optimization
} = require('@webpack-blocks/webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const {common, ROOT_PATH} = require('./blocks/common');
const actionCreator = require('./blocks/action-creator');
const name = require('./blocks/name');
const image = require('./blocks/image');
const babel = require('./blocks/babel');

const development = [
  setMode('development'),
  entryPoint(['@babel/polyfill', 'react-hot-loader/patch', 'webpack-hot-middleware/client']),
  setOutput({
    path: path.resolve(ROOT_PATH, 'build'),
    filename: '[name].js'
  }),
  sourceMaps('eval'),
  addPlugins([new webpack.HotModuleReplacementPlugin()])
];

const production = [
  setMode('production'),
  entryPoint(['@babel/polyfill']),
  setOutput({
    path: path.resolve(ROOT_PATH, 'dist', 'web'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  }),
  sourceMaps('source-map'),
  addPlugins([new ManifestPlugin({fileName: 'asset-manifest.json'})])
];

module.exports = createConfig([
  name('client'),
  actionCreator(path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend')),
  babel(),
  common,
  setOutput({publicPath: '/'}),
  optimization({
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true
        }
      }
    }
  }),
  image(true),
  env('development', development),
  env('production', production),
  entryPoint([path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend', 'client.tsx')])
]);
