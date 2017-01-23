const path = require('path');
const {addPlugins, customConfig, env, setOutput, resolveAliases, webpack} = require('@webpack-blocks/webpack');
const postcss = require('@webpack-blocks/postcss');
const noParse = require('./no-parse');
const vars = require('postcss-simple-vars');
const calc = require('postcss-calc');
const color = require('postcss-color-function');
const autoprefixer = require('autoprefixer');
const {postCssConfig} = require('./postcss');
const {group} = require('./group');
const ROOT_PATH = path.resolve(__dirname, '..', '..', '..');

exports.common = group([
  setOutput({publicPath: '/'}),
  customConfig({
    resolve: {extensions: ['', '.js', '.jsx', '.json']},
    module: {
      loaders: [{test: /\.json$/, loaders: 'json-loader'}]
    }
  }),
  resolveAliases({'socket.io-client': path.resolve(ROOT_PATH, 'node_modules', 'socket.io-client', 'socket.io.js')}),
  noParse([/socket.io-client/]),
  postCssConfig([
    vars({
      variables: function variables() {
        return require(ROOT_PATH + '/src/presentation/frontend/ui/config');
      }
    }),
    calc,
    autoprefixer,
    color
  ]),
  addPlugins([new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')})]),

  env('development', [
    setOutput({pathinfo: true}),
    customConfig({
      cache: true,
      debug: true,
      stats: {
        colors: true,
        reasons: true
      }
    })
  ]),

  env('production', [
    customConfig({
      cache: false,
      debug: false
    }),
    addPlugins([
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.OccurrenceOrderPlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: {screw_ie8: true, warnings: false},
        mangle: {except: ['Deploy', 'Server', 'Group', 'Stack', 'User']}
      })
    ])
  ])
]);

exports.ROOT_PATH = ROOT_PATH;
