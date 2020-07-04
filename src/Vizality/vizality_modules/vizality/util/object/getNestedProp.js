const { get } = require('lodash');

module.exports = (object, path, defaultValue) => {
  return get(object, path, defaultValue);
};
