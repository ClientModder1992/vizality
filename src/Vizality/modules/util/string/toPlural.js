const pluralize = require('pluralize');

const toPlural = (string) => {
  if (!string) return '';

  return String(pluralize(string));
};

module.exports = toPlural;
