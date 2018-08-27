function noParse(paths) {
  return (context, {merge}) =>
    merge({
      module: {
        noParse: paths
      }
    });
}

module.exports = noParse;
