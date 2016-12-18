var webpack = require('webpack');
var merge = require('webpack-merge');
var path = require('path');
var config = require('config');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var {commonDevConfig, commonDistConfig, ROOT_PATH} = require('./common');

var commonClientConfig = {
  name: 'browser',
  entry: {
    app: [path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend', 'client.jsx')],
    vendors: [
      'autobind-decorator', 'bluebird', 'classnames', 'ftchr', 'junction-normalizr-decorator',
      'junction-proptype-decorator', 'lodash.isfunction', 'date-fns/distance_in_words_to_now',
      'normalizr', 'react', 'react-addons-transition-group', 'react-cornerstone/client',
      'react-cornerstone/common', 'react-custom-scrollbars', 'react-dom', 'react-redux',
      'react-paginate', 'react-router', 'react-router-redux', 'react-select', 'recompose',
      'redux', 'redux-auth-wrapper', 'redux-action-creator', 'redux-connect', 'reselect',
      'string', 'velocity-animate']
  },
  output: {
    filename: 'main.js',
    publicPath: '/'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin('vendors', 'vendors.js'),
    new ExtractTextPlugin('main.css', {allChunks: true}),
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {test: /actions\.js$/, include: path.resolve(ROOT_PATH, 'src', 'presentation', 'frontend'), loader: require.resolve('universal-action-creator-loader')},
      {test: /\.css$/, include: /node_modules|assets\/vendor/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
      {test: /\.(jpe?g|png|gif)$/i, loaders: ['file?hash=sha512&digest=hex&name=[hash].[ext]', 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']}
    ]
  }
};

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  module.exports = merge({
    output: {path: path.resolve(ROOT_PATH, 'build', 'web')},
    module: {
      loaders: [
        {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: {presets: ['react-hmre']}},
        {test: /\.css$/, include: path.resolve(ROOT_PATH, 'src'), exclude: /node_modules|assets\/vendor/, loader: 'style-loader!css-loader?sourceMap&module&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader'}
      ]
    },
    devtool: 'eval',
    devServer: {
      contentBase: 'web',
      host: '0.0.0.0',
      port: config.server.port - 1,
      historyApiFallback: true,
      compress: true,
      stats: {
        chunks: false,
        children: false,
        colors: true
      },
      proxy: {
        '/socket.io': {
          target: `ws://localhost:${config.server.port}`,
          ws: true
        },
        '**' : `http://localhost:${config.server.port}`
      }
    }
  }, commonDevConfig, commonClientConfig);
}
else {
  module.exports = merge({
    devtool: 'source-map',
    output: {path: path.resolve(ROOT_PATH, 'dist', 'web')},
    module: {
      loaders: [
        {test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader'},
        {test: /\.css$/, include: path.resolve(ROOT_PATH, 'src'), exclude: /node_modules|assets\/vendor/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?module&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader')}
      ]
    }
  }, commonDistConfig, commonClientConfig);
}
