const path = require('path');
const config = require('config');
const {createConfig} = require('@webpack-blocks/core')
const {addPlugins, entryPoint, env, setOutput, sourceMaps, webpack} = require('@webpack-blocks/webpack');
const WebpackMd5Hash = require('webpack-md5-hash');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const {common, ROOT_PATH} = require('./blocks/common');
const actionCreator = require('./blocks/action-creator');
const image = require('./blocks/image');
const babel = require('./blocks/babel');
const devServer = require('./blocks/dev-server');
const extractCss = require('./blocks/extract-css');
const {postCss} = require('./blocks/postcss');

const development = [
  setOutput({
    path: path.resolve(ROOT_PATH, 'build', 'web'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }),
  babel({presets: ['react-hmre']}),
  postCss(),
  extractCss('main.css'),
  sourceMaps('eval'),
  devServer({
    contentBase: 'web',
    host: '0.0.0.0',
    port: config.server.port - 1,
  }),
  devServer.proxy({
    '/socket.io': {
      target: `ws://localhost:${config.server.port}`,
      ws: true
    },
    '**' : `http://localhost:${config.server.port}`
  })
];

const production = [
  setOutput({
    path: path.resolve(ROOT_PATH, 'dist', 'web'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  }),
  babel(),
  postCss(true),
  extractCss('main.[chunkhash].css'),
  sourceMaps('source-map')
];

module.exports = createConfig([
  common,
  entryPoint({
    main: [path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend', 'client.jsx')],
    vendors: [
      'autobind-decorator', 'bluebird', 'classnames', 'ftchr', 'junction-normalizr-decorator',
      'junction-proptype-decorator', 'lodash.isfunction', 'date-fns/distance_in_words_to_now',
      'normalizr', 'react', 'react-addons-transition-group', 'react-cornerstone/client',
      'react-cornerstone/common', 'react-custom-scrollbars', 'react-dom', 'react-redux',
      'react-paginate', 'react-router', 'react-router-redux', 'react-select', 'recompose',
      'redux', 'redux-auth-wrapper', 'redux-action-creator', 'redux-connect', 'reselect',
      'string', 'velocity-animate']
  }),
  setOutput({publicPath: '/'}),
  addPlugins([
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors', minChunks: Infinity}),
    new WebpackMd5Hash(),
    new ManifestPlugin({fileName: 'asset-manifest.json'}),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: '__WEBPACK_MANIFEST__'
    }),
    new webpack.NoErrorsPlugin()
  ]),
  image(true),
  env('development', development),
  env('production', production),
  actionCreator(path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend')) // must come after babel transpilation
]);
