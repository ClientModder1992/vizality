const { logger: { warn } } = require('@utilities');

const _getModules = require('./_getModules');

/**
 * Grabs all found modules from the webpack store.
 * @param {Function|Array} filter Filter used to grab the module
 * @returns {Array<WebpackModule>|undefined} The found modules
 */
const getModules = (filter) => {
  const _module = 'Module';
  const _submodule = 'Webpack:getModules';

  const originalFilter = filter;
  let outputModule = `${filter}`;

  if (Array.isArray(originalFilter)) {
    filter = m => originalFilter.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
    outputModule = `[ '${originalFilter.join('\', \'')}' ]`;
  }

  return _getModules(filter, true) || warn(_module, _submodule, null, `Module called but not found: getModules(${outputModule})`);
};

module.exports = getModules;
