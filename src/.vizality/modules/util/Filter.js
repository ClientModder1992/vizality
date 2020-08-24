/**
 * @copyright MIT License - (c) 2018 Zachary Rauen
 * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/webpackmodules.js#L18}
 */

/**
 * Filters for use with {@link module:Webpack} specifically, but can be useful
 * in other situations as well.
 * @module Util.Filter
 * @namespace Util.Filter
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class Filter {
  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a set of properties.
   * @param {Array<string>} props Array of property names
   * @param {module:Util.filter~filter} filter Additional filter
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties
   */
  static byProperties (props, filter = m => m) {
    return module => {
      const component = filter(module);
      if (!component) return false;
      return props.every(property => component[property] !== undefined);
    };
  }

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a set of properties on the object's prototype.
   * @param {Array<string>} fields Array of property names
   * @param {module:Util.filter~filter} filter Additional filter
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties on the object's prototype
   */
  static byPrototypeFields (fields, filter = m => m) {
    return module => {
      const component = filter(module);
      if (!component) return false;
      if (!component.prototype) return false;
      return fields.every(field => component.prototype[field] !== undefined);
    };
  }

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a regex.
   * @param {RegExp} search A RegExp to check on the module
   * @param {module:Util.filter~filter} filter Additional filter
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties
   */
  static byCode (search, filter = m => m) {
    return module => {
      const method = filter(module);
      if (!method) return false;
      let methodString = '';
      try { methodString = method.toString([]); }
      catch (err) { methodString = method.toString(); }
      return methodString.search(search) !== -1;
    };
  }

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by strings.
   * @param {...string} strings A RegExp to check on the module
   * @returns {module:Util.filter~filter} A filter that checks for a set of strings
   */
  static byString (...strings) {
    return module => {
      let moduleString = '';
      try { moduleString = module.toString([]); }
      catch (err) { moduleString = module.toString(); }
      for (const s of strings) {
        if (!moduleString.includes(s)) return false;
      }
      return true;
    };
  }

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a set of properties.
   * @param {string} name Name the module should have
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties
   */
  static byDisplayName (name) {
    return module => {
      return module && module.displayName === name;
    };
  }

  /**
   * Generates a combined {@link module:Util.Filter~filter} from a list of filters.
   * @param {...module:Util.filter~filter} filters A list of filters
   * @returns {module:Util.filter~filter} Combinatory filter of all arguments
   */
  static combine (...filters) {
    return module => {
      return filters.every(filter => filter(module));
    };
  }
};
