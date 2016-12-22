module.exports = devServer;

devServer.proxy = proxy;

function devServer(options) {
  const defaults = {
    historyApiFallback: true,
    compress: true,
    stats: {
      chunks: false,
      children: false,
      colors: true
    }
  };
  return () => ({devServer: Object.assign(defaults, options)});
}

function proxy(routes) {
  return () => ({devServer: {proxy: routes}});
}
