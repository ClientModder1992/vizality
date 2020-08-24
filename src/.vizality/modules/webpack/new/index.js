/**
 * @copyright MIT License - (c) 2018 Zachary Rauen
 * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/webpackmodules.js}
 */

const { Filter } = require('@util');

/**
 * Random set of utilities that didn't fit elsewhere. Most of
 * the code here is sourced from @see {@link https://github.com/rauenzi/BDPluginLibrary}
 * @module Webpack
 * @namespace Webpack
 * @version 0.0.1
 */
module.exports = class Webpack {
  static find (filter, first = true) {
    return this.getModule(filter, first);
  }

  static findAll (filter) {
    return this.getModule(filter, false);
  }

  static findByUniqueProperties (props, first = true) {
    return first ? this.getByProps(...props) : this.getAllByProps(...props);
  }

  static findByDisplayName (name) {
    return this.getByDisplayName(name);
  }

  /**
   * Finds a module using a filter function.
   * @param {Function} filter A function to use to filter modules
   * @param {boolean} [first=true] Whether to return only the first matching module
   * @returns {*}
   */
  static getModule (filter, first = true) {
    const wrappedFilter = (m) => {
      try {
        return filter(m);
      }
      catch (err) {
        return false;
      }
    };
    const modules = Webpack.getAllModules();
    const rm = [];
    for (const index in modules) {
      if (!modules.hasOwnProperty(index)) continue;
      const module = modules[index];
      const { exports } = module;
      let foundModule = null;

      if (!exports) continue;
      if (exports.__esModule && exports.default && wrappedFilter(exports.default)) foundModule = exports.default;
      if (wrappedFilter(exports)) foundModule = exports;
      if (!foundModule) continue;
      if (first) return foundModule;
      rm.push(foundModule);
    }
    return first || rm.length === 0 ? undefined : rm;
  }

  /**
   * Gets the index in the webpack require cache of a specific
   * module using a filter.
   * @param {Function} filter A function to use to filter modules
   * @returns {?number}
   */
  static getIndex (filter) {
    const wrappedFilter = (m) => {
      try {
        return filter(m);
      }
      catch (err) {
        return false;
      }
    };
    const modules = this.getAllModules();
    for (const index in modules) {
      if (!modules.hasOwnProperty(index)) continue;
      const module = modules[index];
      const { exports } = module;
      let foundModule = null;

      if (!exports) continue;
      if (exports.__esModule && exports.default && wrappedFilter(exports.default)) foundModule = exports.default;
      if (wrappedFilter(exports)) foundModule = exports;
      if (!foundModule) continue;
      return index;
    }
    return null;
  }

  /**
   * Gets the index in the webpack require cache of a specific
   * module that was already found.
   * @param {*} module An already acquired module
   * @returns {?number}
   */
  static getIndexByModule (module) {
    return this.getIndex(m => m === module);
  }

  /**
   * Finds all modules matching a filter function.
   * @param {Function} filter A function to use to filter modules
   * @returns {WebpackModule}
   */
  static getModules (filter) {
    return this.getModule(filter, false);
  }

  /**
   * Finds a module by its display name.
   * @param {string} name The display name of the module
   * @returns {*}
   */
  static getByDisplayName (name) {
    return this.getModule(Filter.byDisplayName(name), true);
  }

  /**
   * Finds a module using its code.
   * @param {RegExp} regex A regular expression to use to filter modules
   * @param {boolean} first Whether to return the only the first matching module
   * @returns {*}
   */
  static getByRegex (regex, first = true) {
    return this.getModule(Filter.byCode(regex), first);
  }

  /**
   * Finds a single module using properties on its prototype.
   * @param {...string} prototypes Properties to use to filter modules
   * @returns {*}
   */
  static getByPrototypes (...prototypes) {
    return this.getModule(Filter.byPrototypeFields(prototypes), true);
  }

  /**
   * Finds all modules with a set of properties of its prototype.
   * @param {...string} prototypes Properties to use to filter modules
   * @returns {*}
   */
  static getAllByPrototypes (...prototypes) {
    return this.getModule(Filter.byPrototypeFields(prototypes), false);
  }

  /**
   * Finds a single module using its own properties.
   * @param {...string} props Properties to use to filter modules
   * @returns {*}
   */
  static getByProps (...props) {
    return this.getModule(Filter.byProperties(props), true);
  }

  /**
   * Finds all modules with a set of properties.
   * @param {...string} props Properties to use to filter modules
   * @returns {*}
   */
  static getAllByProps (...props) {
    return this.getModule(Filter.byProperties(props), false);
  }

  /**
   * Finds a single module using a set of strings.
   * @param {...string} strings Strings to use to filter modules
   * @returns {*}
   */
  static getByString (...strings) {
    return this.getModule(Filter.byString(...strings), true);
  }

  /**
   * Finds all modules with a set of strings.
   * @param {...string} strings Strings to use to filter modules
   * @returns {*}
   */
  static getAllByString (...strings) {
    return this.getModule(Filter.byString(...strings), false);
  }

  /**
   * Gets a specific module by index of the webpack require cache.
   * Best used in combination with getIndex in order to patch a
   * specific function.
   *
   * Note: this gives the **raw** module, meaning the actual module
   * is in returnValue.exports. This is done in order to be able
   * to patch modules which export a single function directly.
   * @param {number} index Index into the webpack require cache
   * @returns {*}
   */
  static getByIndex (index) {
    return this.require.c[index].exports;
  }

  /**
   * Discord's __webpack_require__ function.
   * @returns {*}
   */
  static get require () {
    if (this._require) return this._require;
    const id = 'zl-webpackmodules';
    let __webpack_require__;
    if (typeof (window.webpackJsonp) === 'function') {
      __webpack_require__ = window.webpackJsonp([], {
        [id]: (module, exports, __webpack_require__) => exports.default = __webpack_require__
      }, [ id ]).default;
    }
    else {
      __webpack_require__ = window.webpackJsonp.push([ [], {
        [id]: (module, exports, __webpack_require__) => module.exports = __webpack_require__
      }, [ [ id ] ] ]);
    }
    delete __webpack_require__.m[id];
    delete __webpack_require__.c[id];
    return this._require = __webpack_require__;
  }

  /**
   * Returns all loaded modules.
   * @returns {Array}
   */
  static getAllModules () {
    return this.require.c;
  }
};
