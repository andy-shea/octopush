module.exports = babel;

function babel(options) {
  return () => ({
    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: {
          loader: 'babel-loader',
          options: Object.assign({cacheDirectory: '/tmp'}, options)
        }
      }]
    }
  });
}
