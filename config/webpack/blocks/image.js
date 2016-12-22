module.exports = image;

function image(emitFile) {
  const fileLoader = 'file?emitFile=' + (emitFile ? 'true' : 'false') + '&hash=sha512&digest=hex&name=[hash].[ext]';
  return () => ({
    module: {
      loaders: [{test: /\.(jpe?g|png|gif)$/i, loaders: [fileLoader, 'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false']}]
    }
  });
}
