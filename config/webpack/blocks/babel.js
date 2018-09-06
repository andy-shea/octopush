function babel(options) {
  return (context, {merge}) =>
    merge({
      resolve: {
        extensions: ['ts', 'tsx']
      },
      module: {
        rules: [
          {
            test: /\.(j|t)sx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: Object.assign({cacheDirectory: '/tmp'}, options)
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: ['source-map-loader'],
            enforce: 'pre'
          }
        ]
      }
    });
}

module.exports = babel;
