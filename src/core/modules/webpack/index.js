/* eslint-disable no-unused-vars */
/**
 *
 * @module Webpack
 */

import { log, warn, error } from '../util/Logger';
import moduleFilters from './modules.json';
import { sleep } from '../util/Time';

/** @private */
const _module = 'Module';
const _submodule = 'Webpack';
const _log = (...message) => log({ labels: [ _module, _submodule ], message });
const _warn = (...message) => warn({ labels: [ _module, _submodule ], message });
const _error = (...message) => error({ labels: [ _module, _submodule ], message });

/**
 * Grabs a module from the Webpack store
 * @param {Function|Array} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
 * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The found module. A promise will always be returned, unless retry is false.
 * @private
 */
const _getModule = (filter, retry = false, forever = false) => {
  if (Array.isArray(filter)) {
    const keys = filter;
    filter = m => keys.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
  }

  if (!retry) return _getModules(filter);

  return new Promise(async res => {
    let mdl;
    for (let i = 0; i < (forever ? 666 : 21); i++) {
      mdl = _getModules(filter);
      if (mdl) return res(mdl);
      await sleep(100);
    }
    res(mdl);
  });
};

/**
 *
 * @param {*} filter
 * @param {*} all
 * @returns
 * @private
 */
const _getModules = (filter, all = false) => {
  const moduleInstances = Object.values(this.instance.cache).filter(m => m.exports);

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
};

/**
 * Initializes the injection into Webpack.
 * @returns {Promise<void>}
 */
export const _initializeModules = async () => {
  // Wait until webpack is ready
  while (!window.webpackJsonp || window.webpackJsonp.flat(10).length < 5000) await sleep(200);
  const instance = window.webpackJsonp.push([
    [],
    {
      _vizality: (_, e, r) => {
        e.cache = r.c;
        e.require = r;
      }
    },
    [ [ '_vizality' ] ]
  ]);

  delete instance.cache._vizality;
  this.instance = instance;
  // Load modules pre-fetched
  for (const mdl in moduleFilters) {
    this[mdl] = await _getModule(moduleFilters[mdl], true);
  }
};

export const findComponent = (keyword, exact = false) => {
  if (!keyword) {
    return _warn('First argument provided must be a string.');
  }

  let byDisplayName, byDefault, byType;
  const results = {};

  if (exact) {
    byDisplayName = this.getModuleByDisplayName(keyword);
    byDefault = this.getModules(m => m.default && m.default.displayName === keyword);
    byType = this.getModules(m => m.type && m.type.displayName === keyword);
  } else {
    keyword = keyword.toLowerCase();
    byDisplayName = this.getModules(m => m.displayName && m.displayName.toLowerCase().indexOf(keyword) > -1);
    byDefault = this.getModules(m => m.default && m.default.displayName && m.default.displayName.toLowerCase().indexOf(keyword) > -1);
    byType = this.getModules(m => m.type && m.type.displayName && m.type.displayName.toLowerCase().indexOf(keyword) > -1);
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

  if (!results || !Object.keys(results).length) {
    return _warn(`No results found for components ${exact ? 'matching' : 'containing'} '${keyword}'`);
  }

  let count = 0;
  const resultsText = count === 1 ? 'result' : 'results';

  Object.keys(results).forEach(key => count += results[key].matches.length);

  _log(`${count} ${resultsText} found for components ${exact ? 'matching' : 'containing'} '${keyword}':\n`);

  return results;
};

/**
 * Gets all cached Webpack modules.
 * @returns {object[]} Cached Webpack modules
 */
export const getAllModules = () => {
  return this.getModules(m => m);
};

export const getModule = (...filter) => {
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
    [ filter ] = filter;
  }

  return _getModule(filter, retry, forever);
};

/**
 * Grabs a React component by its display name
 * @param {string} displayName Component's display name.
 * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
 */
export const getModuleByDisplayName = (displayName, retry = false, forever = false) => {
  return _getModule(m => m?.displayName && m?.displayName?.toLowerCase() === displayName?.toLowerCase(), retry, forever);
};

/**
 * Grabs a Webpack module by its ID.
 * @param {string} id Webpack module's ID
 * @param {boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
 * @param {boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
 * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
 */
export const getModuleById = (id, retry = false, forever = false) => {
  return _getModule(m => m?._dispatchToken === `ID_${id}`, retry, forever);
};

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
export const getModuleByPrototypes = (filter, retry = false, forever = false) => {
  return _getModule(m => m.prototype && filter.every(prop => m.prototype[prop]), retry, forever);
};

/**
 * Grabs all found modules from the webpack store.
 * @param {Function|Array} filter Filter used to grab the module
 * @returns {Array<WebpackModule>|undefined} The found modules
 */
export const getModules = (filter) => {
  if (Array.isArray(filter)) {
    const keys = filter;
    filter = m => keys.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
  }
  return _getModules(filter, true);
};

export const getModulesByKeyword = (keyword, exact = false) => {
  return this.getModules(module => {
    const modules = [ ...Object.keys(module), ...Object.keys(module.__proto__) ];
    for (const mdl of modules) {
      if (exact) {
        if (mdl === keyword) {
          return true;
        }
      } else {
        if (mdl.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          return true;
        }
      }
    }
    return false;
  });
};

export default this;
