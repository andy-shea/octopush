module.exports = favicon;

function favicon(pathPrefix) {
  return () => ({
    module: {
      rules: [{
        test: /ui\/favicons/,
        use: [{
          loader: 'file-loader',
          options: {name: (pathPrefix || '') + '[name].[ext]'}
        }]
      }]
    }
  });
}
