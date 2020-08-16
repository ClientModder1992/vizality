const getModules = require('./getModules');

/**
 * Gets all cached Webpack modules.
 * @returns {object[]} Cached Webpack modules
 */
const getAllModules = () => {
  return getModules(m => m);
};

module.exports = getAllModules;
