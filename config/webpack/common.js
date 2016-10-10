var webpack = require('webpack');
var merge = require('webpack-merge');
var fs = require('fs');
var path = require('path');
var vars = require('postcss-simple-vars');
var calc = require('postcss-calc');
var color = require('postcss-color-function');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var ROOT_PATH = path.resolve(__dirname, '..', '..');

var commonConfig = {
  output: {publicPath: '/'},
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /en$/)
  ],
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    alias: {'socket.io-client': path.resolve(ROOT_PATH, 'node_modules', 'socket.io-client', 'socket.io.js')}
  },
  module: {
    noParse: [/socket.io-client/],
    loaders: [{test: /\.json$/i, loaders: ['json']}]
  },
  postcss: [
    vars({
      variables: function variables() {
        return require('../../src/presentation/frontend/ui/config');
      }
    }),
    calc,
    autoprefixer,
    color
  ]
};

var commonDevConfig = merge({
  cache: true,
  debug: true,
  stats: {
    colors: true,
    reasons: true
  },
  output: {pathinfo: true},
  plugins: [new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('development')})]
}, commonConfig);

var commonDistConfig = merge({
  cache: false,
  debug: false,
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')})
  ]
}, commonConfig);

module.exports = {commonDevConfig, commonDistConfig, ROOT_PATH};
