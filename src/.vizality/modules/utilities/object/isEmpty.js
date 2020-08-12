const { isEmpty: isEmptyObject } = require('lodash');

const isEmpty = (value) => {
  return isEmptyObject(value);
};

module.exports = isEmpty;
