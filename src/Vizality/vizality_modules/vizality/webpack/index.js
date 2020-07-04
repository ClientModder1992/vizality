/* eslint-disable no-undefined */

const { sleep } = require('vizality/util');
const moduleFilters = require('./modules');

/**
 * @typedef WebpackInstance
 * @property {object} cache
 * @property {function} require
 */

class Webpack {
  /**
   * Grabs a module from the Webpack store
   * @param {Function|Array} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
   * @param {Boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
   * @param {Boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
   * @returns {Promise<object>|object} The found module. A promise will always be returned, unless retry is false.
   */
  static getModule (filter, retry = true, forever = false) {
    if (Array.isArray(filter)) {
      const keys = filter;
      filter = m => keys.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
    }

    if (!retry) {
      return Webpack._getModules(filter);
    }

    return new Promise(async (res) => {
      let mdl;
      for (let i = 0; i < (forever ? 666 : 21); i++) {
        mdl = Webpack._getModules(filter);
        if (mdl) {
          return res(mdl);
        }
        await sleep(100);
      }

      res(mdl);
    });
  }

  /**
   * Grabs a module using properties on its prototype.
   * @param {String} filter Properties to use to filter modules
   * @param {Boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
   * @param {Boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
   * @returns {Promise<object>|object} The found module. A promise will always be returned, unless retry is false.
   */
  static getModuleByPrototypes (filter, retry = true, forever = false) {
    return Webpack.getModule(m => m.prototype && filter.every(prop => m.prototype[prop] !== undefined), retry, forever);
  }

  /**
   * Grabs all found modules from the webpack store
   * @param {Function|Array} filter Filter used to grab the module. Can be a function or an array of keys the object must have.
   * @returns {Array<object>} The found modules.
   */
  static getAllModules (filter) {
    if (Array.isArray(filter)) {
      const keys = filter;
      filter = m => keys.every(key => m.hasOwnProperty(key) || (m.__proto__ && m.__proto__.hasOwnProperty(key)));
    }

    return Webpack._getModules(filter, true);
  }

  /**
   * Grabs a React component by its display name
   * @param {String} displayName Component's display name.
   * @param {Boolean} retry Whether or not to retry fetching if the module is not found. Each try will be delayed by 100ms and max retries is 20.
   * @param {Boolean} forever If Vizality should try to fetch the module forever. Should be used only if you're in early stages of startup.
   * @returns {Promise<object>|object} The component. A promise will always be returned, unless retry is false.
   */
  static getModuleByDisplayName (displayName, retry = true, forever = false) {
    return Webpack.getModule(m => m.displayName && m.displayName.toLowerCase() === displayName.toLowerCase(), retry, forever);
  }

  /**
   * Initializes the injection into Webpack
   * @returns Promise<Void>
   */
  static async init () {
    // Wait until webpack is ready
    while (!window.webpackJsonp) {
      await sleep(1);
    }

    // Extract values from webpack
    const moduleID = Math.random.toString();
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
    Webpack.instance = instance;

    // Load modules pre-fetched
    for (const mdl in moduleFilters) {
      // noinspection JSUnfilteredForInLoop
      Webpack[mdl] = await Webpack.getModule(moduleFilters[mdl]);
    }
  }

  static _getModules (filter, all = false) {
    const moduleInstances = Object.values(Webpack.instance.cache).filter(m => m.exports);
    if (all) {
      const exports = moduleInstances.filter(m => filter(m.exports)).map(m => m.exports);
      const expDefault = moduleInstances.filter(m => m.exports.default && filter(m.exports.default)).map(m => m.exports.default);
      return exports.concat(expDefault);
    }

    const exports = moduleInstances.find(m => filter(m.exports));
    if (exports) {
      return exports.exports;
    }
    const expDefault = moduleInstances.find(m => m.exports.default && filter(m.exports.default));
    if (expDefault) {
      return expDefault.exports.default;
    }
    return null;
  }
}

module.exports = Webpack;
