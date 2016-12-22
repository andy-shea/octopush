const fs = require('fs');

module.exports = node;

var nodeModules = {};
fs.readdirSync('node_modules').filter(function read(x) {
  return ['.bin'].indexOf(x) === -1;
}).forEach(function modules(mod) {
  nodeModules[mod] = 'commonjs ' + mod;
});

function node() {
  return () => ({
    target: 'node',
    node: {__dirname: true, __filename: true},
    resolve: {extensions: ['.node']},
    externals: nodeModules,
    module: {
      loaders: [{test: /\.node$/, loader: 'node-loader'}]
    }
  });
}
