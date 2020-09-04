/* eslint-disable brace-style */
const moduleFilters = require('./modules.json');
const { log, warn } = require('../utilities/logger');
const sleep = require('../utilities/sleep');

const _module = 'Module';
const _submodule = 'Webpack';

/**
 * @module webpack
 * @namespace webpack
 * @version 0.0.1
 */
const webpack = module.exports = {
  /**
   * Grabs a module from the Webpack store
   * @param {Function|Array} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
   * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
   * @param {boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
   * @returns {Promise<object>|object} The found module. A promise will always be returned, unless retry is false.
   * @private
   */
  _getModule (filter, retry = false, forever = false) {
    if (Array.isArray(filter)) {
      const keys = filter;
      filter = m => keys.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
    }

    if (!retry) return webpack._getModules(filter);

    return new Promise(async res => {
      let mdl;
      for (let i = 0; i < (forever ? 666 : 21); i++) {
        mdl = webpack._getModules(filter);
        if (mdl) return res(mdl);
        await sleep(100);
      }
      res(mdl);
    });
  },

  _getModules (filter, all = false) {
    const moduleInstances = Object.values(webpack.instance.cache).filter(m => m.exports);

    if (all) {
      const exports = moduleInstances.filter(m => filter(m.exports)).map(m => m.exports);
      const expDefault = moduleInstances.filter(m => m.exports.default && filter(m.exports.default)).map(m => m.exports.default);
      return exports.concat(expDefault);
    }

    const exports = moduleInstances.find(m => filter(m.exports));

    if (exports) { return exports.exports; }

    const expDefault = moduleInstances.find(m => m.exports.default && filter(m.exports.default));

    if (expDefault) { return expDefault.exports.default; }

    return null;
  },

  /**
   * Initializes the injection into Webpack.
   * @returns {Promise<void>}
   */
  async initialize () {
    delete webpack.initialize;

    // Wait until webpack is ready
    while (!window.webpackJsonp) {
      await sleep(1);
    }

    // Extract values from webpack
    const moduleID = Math.random().toString(36).substring(2);
    const instance = webpackJsonp.push([
      [],
      {
        [moduleID]: (_, e, r) => {
          e.cache = r.c;
          e.require = r;
        }
      },
      [ [ moduleID ] ]
    ]);
    delete instance.cache[moduleID];
    webpack.instance = instance;

    // Load modules pre-fetched
    for (const mdl in moduleFilters) {
      webpack[mdl] = await webpack._getModule(moduleFilters[mdl], true);
    }
  },

  findComponent (keyword, exact = false) {
    if (!keyword) {
      return warn(_module, _submodule, null, `First argument provided must be a string.`);
    }

    let byDisplayName, byDefault, byType;
    const results = {};

    if (exact) {
      byDisplayName = webpack.getModuleByDisplayName(keyword);
      byDefault = webpack.getModules(m => m.default && m.default.displayName === keyword);
      byType = webpack.getModules(m => m.type && m.type.displayName === keyword);
    } else {
      keyword = keyword.toLowerCase();
      byDisplayName = webpack.getModules(m => m.displayName && m.displayName.toLowerCase().indexOf(keyword) > -1);
      byDefault = webpack.getModules(m => m.default && m.default.displayName && m.default.displayName.toLowerCase().indexOf(keyword) > -1);
      byType = webpack.getModules(m => m.type && m.type.displayName && m.type.displayName.toLowerCase().indexOf(keyword) > -1);
    }

    if (byDisplayName && byDisplayName.length) {
      Object.assign(results, {
        displayName: {
          matches: byDisplayName
        }
      });
    }

    if (byDefault && byDefault.length) {
      Object.assign(results, {
        default: {
          matches: byDefault
        }
      });
    }

    if (byType && byType.length) {
      Object.assign(results, {
        type: {
          matches: byType
        }
      });
    }

    const choiceWord = exact ? 'matching' : 'containing';

    if (!results || !Object.keys(results).length) {
      return warn(_module, _submodule, null, `No results found for components ${choiceWord} '${keyword}'`);
    }

    let count = 0;
    const resultsText = count === 1 ? 'result' : 'results';

    Object.keys(results).forEach(key => count += results[key].matches.length);

    log(_module, _submodule, null, `${count} ${resultsText} found for components ${choiceWord} '${keyword}':\n`);

    return results;
  },

  /**
   * Gets all cached Webpack modules.
   * @returns {object[]} Cached Webpack modules
   */
  getAllModules () {
    return webpack.getModules(m => m);
  },

  getModule (...filter) {
    let retry = false;
    let forever = false;

    if (typeof filter[filter.length - 1] === 'boolean') {
      forever = filter.pop();
      if (typeof filter[filter.length - 1] === 'boolean') {
        retry = filter.pop();
      } else {
        retry = forever;
        forever = false;
      }
    }

    if (typeof filter[0] === 'function') {
      ([ filter ] = filter); // Thanks Lighty, I still don't understand this syntax.
    }

    return webpack._getModule(filter, retry, forever);
  },

  /**
   * Grabs a React component by its display name
   * @param {string} displayName Component's display name.
   * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
   * @param {boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
   * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
   */
  getModuleByDisplayName (displayName, retry = false, forever = false) {
    return webpack._getModule(m => m.displayName && m.displayName.toLowerCase() === displayName.toLowerCase(), retry, forever);
  },

  /**
   * Grabs a Webpack module by its ID.
   * @param {string} id Webpack module's ID
   * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
   * @param {boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
   * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
   */
  getModuleById (id, retry = false, forever = false) {
    return webpack._getModule(m => m._dispatchToken && m._dispatchToken === `ID_${id}`, retry, forever);
  },

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
  getModuleByPrototypes (filter, retry = false, forever = false) {
    return webpack._getModule(m => m.prototype && filter.every(prop => m.prototype[prop]), retry, forever);
  },

  /**
   * Grabs all found modules from the webpack store.
   * @param {Function|Array} filter Filter used to grab the module
   * @returns {Array<WebpackModule>|undefined} The found modules
   */
  getModules (filter) {
    if (Array.isArray(filter)) {
      const keys = filter;
      filter = m => keys.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
    }
    return webpack._getModules(filter, true);
  },

  getModulesByKeyword (keyword, exact = false) {
    return webpack.getModules(module => {
      const modules = [ ...Object.keys(module), ...Object.keys(module.__proto__) ];
      for (const mdl of modules) {
        if (exact) { if (mdl === keyword) return true; }
        else { if (mdl.toLowerCase().indexOf(keyword.toLowerCase()) > -1) return true; }
      }
      return false;
    });
  }
};
