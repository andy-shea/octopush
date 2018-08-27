const fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function read(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function modules(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

function node() {
  return (context, {merge}) =>
    merge({
      target: 'node',
      node: {__dirname: true, __filename: true},
      resolve: {extensions: ['.node']},
      externals: nodeModules,
      module: {
        rules: [{test: /\.node$/, loader: 'node-loader'}]
      }
    });
}

module.exports = node;
