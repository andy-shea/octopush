function actionCreator(include) {
  return (context, {addLoader}) =>
    addLoader(
      Object.assign(
        {
          test: /(actions|routes)\.js$/,
          include,
          loader: require.resolve('universal-action-creator-loader')
        },
        context.match
      )
    );
}

module.exports = actionCreator;
