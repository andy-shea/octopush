const path = require('path');
const config = require('config');
const {createConfig, addPlugins, entryPoint, env, setOutput, sourceMaps, webpack} = require('@webpack-blocks/webpack2');
const WebpackMd5Hash = require('webpack-md5-hash');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const {common, ROOT_PATH} = require('./blocks/common');
const actionCreator = require('./blocks/action-creator');
const name = require('./blocks/name');
const image = require('./blocks/image');
const babel = require('./blocks/babel');
const extractCss = require('./blocks/extract-css');
const postCss = require('./blocks/postcss');

const development = [
  setOutput({
    path: path.resolve(ROOT_PATH, 'build'),
    filename: '[name].js',
    chunkFilename: '[name].js'
  }),
  babel({presets: ['react-hmre']}),
  postCss(),
  extractCss('main.css'),
  sourceMaps('eval')
];

const production = [
  setOutput({
    path: path.resolve(ROOT_PATH, 'dist', 'web'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js'
  }),
  babel(),
  postCss(true),
  extractCss('[name].[chunkhash].css'),
  sourceMaps('source-map')
];

module.exports = createConfig([
  name('client'),
  common,
  entryPoint({
    main: [
      'react-hot-loader/patch',
      'webpack-hot-middleware/client',
      path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend', 'client.jsx')
    ],
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
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin({name: 'vendors', minChunks: Infinity}),
    new WebpackMd5Hash(),
    new ManifestPlugin({fileName: 'asset-manifest.json'}),
    new ChunkManifestPlugin({
      filename: 'chunk-manifest.json',
      manifestVariable: '__WEBPACK_MANIFEST__'
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ]),
  image(true),
  env('development', development),
  env('production', production),
  actionCreator(path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend')) // must come before babel transpilation
]);
