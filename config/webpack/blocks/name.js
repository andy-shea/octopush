function name(name) {
  return (context, {merge}) => merge({name: name});
}

module.exports = name;
