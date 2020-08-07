const pluralize = require('pluralize');

const isPlural = (string) => {
  return pluralize.isPlural(string);
};

module.exports = isPlural;
