const _getMdl = require('./_getMdl');

/*
 * @todo: Make this work like getModule, where it accepts the argument as strings... i.e.
 * getModuleByPrototypes('_log') instead of getModuleByPrototypes([ '_log' ])
 */

/**
 * Grabs a module using properties on its prototype.
 * @param {String} filter Properties to use to filter modules
 * @param {Boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {Boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The found module. A promise will always be returned, unless retry is false.
 */
const getModuleByPrototypes = (filter, retry = false, forever = false) => {
  return _getMdl(
    m => m.prototype && filter.every(prop => m.prototype[prop] !== undefined),
    retry,
    forever,
    'getModuleByPrototypes',
    filter
  );
};

module.exports = getModuleByPrototypes;
