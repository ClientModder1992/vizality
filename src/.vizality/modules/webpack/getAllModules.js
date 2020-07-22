const { logger: { warn } } = require('@util');

const _getModules = require('./_getModules');

/**
 * Grabs all found modules from the webpack store
 * @param {Function|Array} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
 * @returns {Array<object>} The found modules.
 */
const getAllModules = (filter) => {
  const module = 'Module';
  const submodule = 'Webpack:getAllModules';

  const originalFilter = filter;
  let outputModule = `${filter}`;

  if (Array.isArray(originalFilter)) {
    filter = m => originalFilter.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
    outputModule = `[ '${originalFilter.join('\', \'')}' ]`;
  }

  return _getModules(filter, true) || warn(module, submodule, null, `Module called but not found: getAllModules(${outputModule})`);
};

module.exports = getAllModules;
