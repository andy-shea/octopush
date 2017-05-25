module.exports = name;

function name(name) {
  return () => ({name: name});
}
