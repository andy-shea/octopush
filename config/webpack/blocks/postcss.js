const ExtractTextPlugin = require('extract-text-webpack-plugin');

exports.postCssConfig = plugins => () => ({postcss: plugins});

exports.postCss = (extractText, exportMappingsOnly) => () => {
  let query = 'module&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader';
  if (process.env.NODE_ENV === 'development') query = 'sourceMap&' + query;
  const loader = extractText ?
      ExtractTextPlugin.extract('style-loader', 'css-loader?' + query) :
      (exportMappingsOnly ? 'css-loader/locals?' : 'style-loader!css-loader?') + query;

  return {
    module: {
      loaders: [{test: /\.css$/, exclude: /node_modules/, loader: loader}]
    }
  };
};
