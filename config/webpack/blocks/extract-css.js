const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = extractCss;

function extractCss(output) {
  return () => ({
    module: {
      rules: [
        {test: /\.css$/, include: /node_modules/, use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })},
      ]
    },
    plugins: [new ExtractTextPlugin({filename: output, allChunks: true})]
  });
}
