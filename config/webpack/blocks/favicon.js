function favicon(outputPath) {
  return (context, {addLoader}) =>
    addLoader(
      Object.assign(
        {
          type: 'javascript/auto',
          test: /ui\/favicons/,
          loader: 'file-loader',
          options: {
            publicPath: '/',
            outputPath,
            name: '[name].[ext]'
          }
        },
        context.match
      )
    );
}

module.exports = favicon;
