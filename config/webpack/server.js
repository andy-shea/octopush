var fs = require('fs');
var webpack = require('webpack');
var merge = require('webpack-merge');
var path = require('path');
var {commonDevConfig, commonDistConfig, ROOT_PATH} = require('./common');

var nodeModules = {};
fs.readdirSync('node_modules').filter(function read(x) {
  return ['.bin'].indexOf(x) === -1;
}).forEach(function modules(mod) {
  nodeModules[mod] = 'commonjs ' + mod;
});

var commonServerConfig = {
  name: 'server',
  target: 'node',
  node: {__dirname: true, __filename: true},
  entry: {
    app: [path.resolve(ROOT_PATH, 'src', 'presentation', 'server')]
  },
  resolve: {extensions: ['.node']},
  externals: nodeModules,
  output: {filename: 'server.js'},
  module: {
    loaders: [
      {test: /\.node$/, loader: 'node-loader'},
      {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
      {test: /\.css$/, include: /node_modules|assets\/vendor/, loader: 'css-loader'},
      {test: /\.svg$/, exclude: /node_modules/, loader: 'raw'},
      {test: /\.(jpe?g|png|gif)$/i, loaders: ['file?emitFile=false&hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']}
    ]
  },
  plugins: [
    new webpack.BannerPlugin("var promise = require('bluebird');require('babel-runtime/core-js/promise').default = promise;promise.onPossiblyUnhandledRejection(function(error) {throw error});", {raw: true, entryOnly: true})
  ]
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  module.exports = merge({
    devtool: 'cheap-module-source-map',
    output: {path: path.resolve(ROOT_PATH, 'build')},
    plugins: [new webpack.BannerPlugin("require('source-map-support').install();", {raw: true, entryOnly: false})],
    module: {
      loaders: [{test: /\.css$/, exclude: /node_modules|assets\/vendor/, loader: 'css-loader/locals?sourceMap&module&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'}]
    }
  }, commonDevConfig, commonServerConfig);
}
else {
  module.exports = merge({
    output: {path: path.resolve(ROOT_PATH, 'dist')},
    module: {
      loaders: [{test: /\.css$/, exclude: /node_modules|assets\/vendor/, loader: 'css-loader/locals?module&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'}]
    }
  }, commonDistConfig, commonServerConfig);
}
