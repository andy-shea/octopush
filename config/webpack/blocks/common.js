const path = require('path');
const {
  group,
  env,
  customConfig,
  setOutput,
  resolve,
  optimization
} = require('@webpack-blocks/webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const noParse = require('./no-parse');
const ROOT_PATH = path.resolve(__dirname, '..', '..', '..');

exports.common = group([
  setOutput({publicPath: '/'}),
  resolve({
    extensions: ['.jsx'],
    alias: {
      'socket.io-client': path.resolve(
        ROOT_PATH,
        'node_modules',
        'socket.io-client',
        'socket.io.js'
      )
    }
  }),
  noParse([/socket.io-client/]),
  customConfig({
    module: {
      rules: [{test: /\.svg$/, exclude: [/node_modules/, /ui\/favicons/], loader: 'raw-loader'}]
    }
  }),

  env('development', [setOutput({pathinfo: true})]),

  env('production', [
    optimization({
      minimizer: [
        new UglifyJsPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: {screw_ie8: true},
            mangle: {screw_ie8: true, except: ['Deploy', 'Server', 'Group', 'Stack', 'User']},
            output: {screw_ie8: true, comments: false}
          }
        })
      ]
    })
  ])
]);

exports.ROOT_PATH = ROOT_PATH;
