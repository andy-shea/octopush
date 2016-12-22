module.exports = actionCreator;

function actionCreator(include) {
  return () => ({
    module: {
      loaders: [{test: /actions\.js$/, include: include, loader: require.resolve('universal-action-creator-loader')}]
    }
  });
}
