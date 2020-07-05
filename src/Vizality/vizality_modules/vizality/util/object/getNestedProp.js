// @todo: Rework to note use lodash

const { get } = require('lodash');

const getNestedProp = (object, path, defaultValue) => {
  return get(object, path, defaultValue);
};

module.exports = getNestedProp;
