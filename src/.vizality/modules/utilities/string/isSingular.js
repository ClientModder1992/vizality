const pluralize = require('pluralize');

const isSingular = (string) => {
  return pluralize.isSingular(string);
};

module.exports = isSingular;
