function babel(options) {
  return (context, {addLoader}) =>
    addLoader(
      Object.assign(
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: Object.assign({cacheDirectory: '/tmp', presets: ['@babel/preset-env']}, options)
        },
        context.match
      )
    );
}

module.exports = babel;
