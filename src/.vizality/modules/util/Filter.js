/*
 * MIT License
 *
 * Copyright (c) 2018 Zachary Rauen
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

/**
 * Filters for use with {@link module:Webpack} specifically, but can be useful
 * in other situations as well.
 * @module Util.filter
 * @namespace Util.filter
 * @memberof Util
 */
const filter = {
  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a set of properties.
   * @param {Array<string>} props Array of property names
   * @param {module:Util.filter~filter} filter Additional filter
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties
   */
  byProperties (props, filter = m => m) {
    return module => {
      const component = filter(module);
      if (!component) return false;
      return props.every(property => component[property] !== undefined);
    };
  },

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a set of properties on the object's prototype.
   * @param {Array<string>} fields Array of property names
   * @param {module:Util.filter~filter} filter Additional filter
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties on the object's prototype
   */
  byPrototypeFields (fields, filter = m => m) {
    return module => {
      const component = filter(module);
      if (!component) return false;
      if (!component.prototype) return false;
      return fields.every(field => component.prototype[field] !== undefined);
    };
  },

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a regex.
   * @param {RegExp} search A RegExp to check on the module
   * @param {module:Util.filter~filter} filter Additional filter
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties
   */
  byCode (search, filter = m => m) {
    return module => {
      const method = filter(module);
      if (!method) return false;
      let methodString = '';
      try { methodString = method.toString([]); }
      catch (err) { methodString = method.toString(); }
      return methodString.search(search) !== -1;
    };
  },

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by strings.
   * @param {...string} strings A RegExp to check on the module
   * @returns {module:Util.filter~filter} A filter that checks for a set of strings
   */
  byString (...strings) {
    return module => {
      let moduleString = '';
      try { moduleString = module.toString([]); }
      catch (err) { moduleString = module.toString(); }
      for (const s of strings) {
        if (!moduleString.includes(s)) return false;
      }
      return true;
    };
  },

  /**
   * Generates a {@link module:Util.Filter~filter} that filters by a set of properties.
   * @param {string} name Name the module should have
   * @returns {module:Util.filter~filter} A filter that checks for a set of properties
   */
  byDisplayName (name) {
    return module => {
      return module && module.displayName === name;
    };
  },

  /**
   * Generates a combined {@link module:Util.Filter~filter} from a list of filters.
   * @param {...module:Util.filter~filter} filters A list of filters
   * @returns {module:Util.filter~filter} Combinatory filter of all arguments
   */
  combine (...filters) {
    return module => {
      return filters.every(filter => filter(module));
    };
  }
};

module.exports = filter;
