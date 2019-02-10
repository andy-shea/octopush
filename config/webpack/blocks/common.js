const path = require('path');
const {
  group,
  env,
  customConfig,
  setOutput,
  resolve,
  optimization
} = require('@webpack-blocks/webpack');
const TerserPlugin = require('terser-webpack-plugin');
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
        new TerserPlugin({
          parallel: true,
          terserOptions: {
            ecma: 6,
            compress: {},
            keep_classnames: true,
            mangle: {reserved: ['Deploy', 'Server', 'Group', 'Stack', 'User']}
          }
        })
      ]
    })
  ])
]);

exports.ROOT_PATH = ROOT_PATH;
