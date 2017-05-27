const path = require('path');
const {addPlugins, customConfig, env, setOutput, resolveAliases, webpack} = require('@webpack-blocks/webpack2');
const noParse = require('./no-parse');
const {group} = require('./group');
const ROOT_PATH = path.resolve(__dirname, '..', '..', '..');

exports.common = group([
  setOutput({publicPath: '/'}),
  customConfig({resolve: {extensions: ['.js', '.jsx', '.json']}}),
  resolveAliases({'socket.io-client': path.resolve(ROOT_PATH, 'node_modules', 'socket.io-client', 'socket.io.js')}),
  noParse([/socket.io-client/]),
  addPlugins([new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')})]),

  env('development', [
    setOutput({pathinfo: true}),
    customConfig({
      cache: true,
      stats: {
        colors: true,
        reasons: true,
        children: false
      }
    }),
    addPlugins([new webpack.LoaderOptionsPlugin({debug: true})])
  ]),

  env('production', [
    customConfig({cache: false}),
    addPlugins([
      new webpack.optimize.UglifyJsPlugin({
        sourceMap: (process.env.NODE_ENV === 'development'),
        compress: {screw_ie8: true},
        mangle: {screw_ie8: true, except: ['Deploy', 'Server', 'Group', 'Stack', 'User']},
        output: {screw_ie8: true, comments: false}
      })
    ])
  ])
]);

exports.ROOT_PATH = ROOT_PATH;
