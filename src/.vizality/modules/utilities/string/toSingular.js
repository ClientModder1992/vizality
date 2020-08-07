const pluralize = require('pluralize');

const toSingular = (string) => {
  if (!string) return '';

  return String(pluralize.singular(string));
};

module.exports = toSingular;
