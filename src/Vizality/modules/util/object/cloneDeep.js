const { cloneDeep: cloneDeepObject } = require('lodash');

const cloneDeep = (value) => {
  return cloneDeepObject(value);
};

module.exports = cloneDeep;
