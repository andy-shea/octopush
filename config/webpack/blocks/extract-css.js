const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = extractCss;

function extractCss(output) {
  return () => ({
    module: {
      loaders: [
        {test: /\.css$/, include: /node_modules/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader')},
      ]
    },
    plugins: [new ExtractTextPlugin(output, {allChunks: true})]
  });
}
