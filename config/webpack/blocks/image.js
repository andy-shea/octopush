function image(emitFile) {
  return (context, {addLoader}) =>
    addLoader(
      Object.assign(
        {
          test: /\.(jpe?g|png|gif)$/i,
          exclude: /ui\/favicons/,
          use: [
            {
              loader: 'file-loader',
              options: {
                emitFile: emitFile,
                hash: 'sha512',
                digest: 'hex',
                name: '[hash].[ext]'
              }
            }
            // {
            //   loader: 'image-webpack-loader',
            //   options: {
            //     optipng: {optimizationLevel: 7},
            //     gifsicle: {interlaced: false}
            //   }
            // }
          ]
        },
        context.match
      )
    );
}

module.exports = image;
