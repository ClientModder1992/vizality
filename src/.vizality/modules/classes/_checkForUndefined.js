const { logger: { warn } } = require('@util');

const classes = require('../classes');

const _checkForUndefined = async (obj = classes, currentPath = '') => {
  const MODULE = 'Module';
  const SUBMODULE = 'Classes:_checkForUndefined';

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      _checkForUndefined(obj[key], newPath);
    } else if (typeof obj[key] === 'undefined') {
      warn(MODULE, SUBMODULE, null, `Value not found: ${currentPath}.${key}`);
    }
  }
};

module.exports = _checkForUndefined;
