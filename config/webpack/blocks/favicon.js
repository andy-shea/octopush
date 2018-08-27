function favicon(pathPrefix) {
  return (context, {addLoader}) =>
    addLoader(
      Object.assign(
        {
          type: 'javascript/auto',
          test: /ui\/favicons/,
          loader: 'file-loader',
          options: {name: (pathPrefix || '') + '[name].[ext]'}
        },
        context.match
      )
    );
}

module.exports = favicon;
