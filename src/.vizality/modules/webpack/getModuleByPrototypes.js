const _getModule = require('./_getModule');

/*
 * @todo: Make this work like getModule, where it accepts the argument as strings... i.e.
 * getModuleByPrototypes('_log') instead of getModuleByPrototypes([ '_log' ])
 */

/**
 * Grabs a module using properties on its prototype.
 * @param {string} filter Properties to use to filter modules.
 * @param {boolean} retry Whether to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {boolean} forever Whether to try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {WebpackModule|Promise<WebpackModule>} The found module. A promise will only be returned if `retry` is true.
 */
const getModuleByPrototypes = (filter, retry = false, forever = false) => {
  return _getModule(
    m => m.prototype && filter.every(prop => m.prototype[prop]),
    retry,
    forever,
    'getModuleByPrototypes',
    filter
  );
};

module.exports = getModuleByPrototypes;
