module.exports = noParse;

function noParse(paths) {
  return () => ({
    module: {
      noParse: paths
    }
  })
}
