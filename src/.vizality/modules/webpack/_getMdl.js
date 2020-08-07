const { sleep, logger: { warn } } = require('@utilities');

const _getModules = require('./_getModules');

/**
 * Grabs a module from the Webpack store
 * @param {Function|Array} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
 * @param {Boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {Boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The found module. A promise will always be returned, unless retry is false.
 */
const _getMdl = (filter, retry = false, forever = false, caller = '_getMdl', filterArg = filter) => {
  const module = 'Module';
  const submodule = `Webpack:${caller}`;

  if (!filter) return warn(module, submodule, null, 'You must provide at least 1 argument.');

  const originalFilter = filter;
  let outputModule = caller === 'getModuleByDisplayName' ? `'${filterArg}'` : `${filterArg}`;

  if (Array.isArray(originalFilter)) {
    filter = m => originalFilter.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
    outputModule = `'${filterArg.join('\', \'')}'`;
  }

  if (!retry) {
    return _getModules(filter) || warn(module, submodule, null, `Module not found: ${caller}(${outputModule})`);
  }

  return new Promise(async (res) => {
    let mdl;
    for (let i = 0; i < (forever ? 666 : 21); i++) {
      mdl = _getModules(filter);
      if (mdl) {
        return res(mdl);
      }
      await sleep(100);
      // @todo: Add warn log here if not found
    }

    res(mdl);
  });
};

module.exports = _getMdl;
