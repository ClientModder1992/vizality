const convert = require('js-convert-case');

module.exports = (str) => {
  return convert.toPathCase(str);
};
