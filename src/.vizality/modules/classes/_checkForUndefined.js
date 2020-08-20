const { logger: { warn } } = require('@utilities');

const classes = require('../classes');

const _checkForUndefined = async (obj = classes, currentPath) => {
  const _module = 'Module';
  const _submodule = 'Classes:_checkForUndefined';

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      _checkForUndefined(obj[key], newPath);
    } else if (typeof obj[key] === 'undefined') {
      warn(_module, _submodule, null, `Value not found: ${currentPath}.${key}`);
    }
  }
};

module.exports = _checkForUndefined;
