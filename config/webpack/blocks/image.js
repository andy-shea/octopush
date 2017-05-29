module.exports = image;

function image(emitFile) {
  return () => ({
    module: {
      rules: [{
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
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
              optipng: {optimizationLevel: 7},
              gifsicle: {interlaced: false}
            }
          }
        ]
      }]
    }
  });
}
