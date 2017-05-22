const ExtractTextPlugin = require('extract-text-webpack-plugin');
const {ROOT_PATH} = require('./common');

module.exports = postCss;

function loaders(extractText, exportMappingsOnly) {
  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      plugins: loader => [
        require('postcss-simple-vars')({
          variables: function variables() {
            return require(ROOT_PATH + '/src/presentation/frontend/ui/config');
          }
        }),
        require('postcss-calc')(),
        require('autoprefixer')(),
        require('postcss-color-function')()
      ]
    }
  };

  const options = {
    modules: true,
    importLoaders: 1,
    localIdentName: '[name]__[local]___[hash:base64:5]'
  };
  if (process.env.NODE_ENV === 'development') options.sourceMap = true;

  if (extractText) {
    return ExtractTextPlugin.extract({
      fallback: 'style-loader',
      use: [{loader: 'css-loader', options: options}, postcssLoader]
    });
  }

  if (exportMappingsOnly) return [{loader: 'css-loader/locals', options: options}, postcssLoader];

  return ['style-loader', {loader: 'css-loader', options: options}, postcssLoader];
}

function postCss(extractText, exportMappingsOnly) {
  return () => ({
    module: {
      rules: [{test: /\.css$/, exclude: /node_modules/, use: loaders(extractText, exportMappingsOnly)}]
    }
  });
}
