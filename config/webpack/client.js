const path = require('path');
const config = require('config');
const {createConfig, addPlugins, entryPoint, env, setOutput, sourceMaps, webpack} = require('@webpack-blocks/webpack2');
const WebpackMd5Hash = require('webpack-md5-hash');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const NameAllModulesPlugin = require('name-all-modules-plugin');
const {common, ROOT_PATH} = require('./blocks/common');
const actionCreator = require('./blocks/action-creator');
const name = require('./blocks/name');
const image = require('./blocks/image');
const babel = require('./blocks/babel');
const extractCss = require('./blocks/extract-css');
const postCss = require('./blocks/postcss');

const development = [
  entryPoint({main: [
    'babel-polyfill',
    'react-hot-loader/patch',
    'webpack-hot-middleware/client'
  ]}),
  setOutput({
    path: path.resolve(ROOT_PATH, 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }),
  babel({presets: ['react-hmre']}),
  postCss(),
  extractCss('main.css'),
  sourceMaps('inline-source-map'),
  addPlugins([new webpack.HotModuleReplacementPlugin()])
];

const production = [
  entryPoint({main: ['babel-polyfill']}),
  setOutput({
    path: path.resolve(ROOT_PATH, 'dist', 'web'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  }),
  babel(),
  postCss(true),
  extractCss('[name].[chunkhash].css'),
  sourceMaps('source-map'),
  addPlugins([
    new webpack.optimize.CommonsChunkPlugin({name: 'runtime'}),
    new ManifestPlugin({fileName: 'asset-manifest.json'}),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: '__WEBPACK_MANIFEST__'
    })
  ])
];

// caching strategy: https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31
module.exports = createConfig([
  name('client'),
  actionCreator(path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend')),
  common,
  setOutput({publicPath: '/'}),
  addPlugins([
    new webpack.NamedModulesPlugin(),
    new webpack.NamedChunksPlugin(c => c.name || c.modules.map(m => path.relative(m.context, m.request)).join('_')),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendors',
      minChunks: module => module.context && module.context.indexOf('node_modules') !== -1
    }),
    new NameAllModulesPlugin(),
    new WebpackMd5Hash(),
    new webpack.NoEmitOnErrorsPlugin()
  ]),
  image(true),
  env('development', development),
  env('production', production),
  entryPoint({main: path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend', 'client.jsx')})
]);
