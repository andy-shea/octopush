module.exports = babel;

function babel(query) {
  return () => ({
    module: {
      loaders: [{test: /\.jsx?$/, exclude: /node_modules/, loader: 'babel-loader', query: Object.assign({cacheDirectory: '/tmp'}, query)}]
    }
  });
}
