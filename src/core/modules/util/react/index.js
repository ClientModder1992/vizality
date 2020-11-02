/**
 * @module util.react
 * @namespace util.react
 * @memberof util
 * @version 0.0.1
 */
const react = module.exports = {
  /**
   * Finds a value, subobject, or array from a tree that matches a specific filter.
   * @copyright MIT License - (c) 2018 Zachary Rauen
   * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/utilities.js#L140}
   * @param {object} tree Tree that should be walked
   * @param {Function} filter Filter to check against each object and subobject
   * @param {object} options Additional options to customize the search
   * @param {Array<string>|null} [options.walkable=null] Array of strings to use as keys
   * that are allowed to be walked on. Null value indicates all keys are walkable
   * @param {Array<string>} [options.ignore=[]] Array of strings to use as keys to exclude
   * from the search, most helpful when `walkable = null`
   * @returns {Node|undefined}
   */
  findInTree (tree, filter, { walkable = null, ignore = [] } = {}) {
    if (!tree || typeof tree !== 'object') {
      return null;
    }

    if (typeof filter === 'string') {
      if (tree.hasOwnProperty(filter)) {
        return tree[filter];
      }

      return;
    } else if (filter(tree)) {
      return tree;
    }

    let returnValue = null;

    if (Array.isArray(tree)) {
      for (const value of tree) {
        returnValue = react.findInTree(value, filter, {
          walkable,
          ignore
        });

        if (returnValue) {
          return returnValue;
        }
      }
    } else {
      const walkables = !walkable ? Object.keys(tree) : walkable;

      for (const key of walkables) {
        if (!tree.hasOwnProperty(key) || ignore.includes(key)) {
          continue;
        }

        returnValue = react.findInTree(tree[key], filter, {
          walkable,
          ignore
        });

        if (returnValue) {
          return returnValue;
        }
      }
    }

    return returnValue;
  },

  /**
   * Finds a value, subobject, or array from a tree that matches a specific filter. Great
   * for patching render functions.
   * @copyright MIT License - (c) 2018 Zachary Rauen
   * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/utilities.js#L128}
   * @param {object} tree React tree to look through. Can be a rendered object or an internal instance
   * @param {Function} searchFilter Filter function to check subobjects against
   * @returns {Node|undefined}
   */
  findInReactTree (tree, searchFilter) {
    return react.findInTree(tree, searchFilter, { walkable: [ 'props', 'children', 'child', 'sibling' ] });
  },

  getReactInstance (node) {
    return node[Object.keys(node).find(key => key.startsWith('__reactInternalInstance'))];
  },

  getOwnerInstance (node) {
    for (let curr = react.getReactInstance(node); curr; curr = curr.return) {
      const owner = curr.stateNode;
      if (owner && !(owner instanceof HTMLElement)) {
        return owner;
      }
    }

    return null;
  },

  forceUpdateElement (query, all = false) {
    const elements = all ? [ ...document.querySelectorAll(query) ] : [ document.querySelector(query) ];
    return elements.filter(Boolean).forEach(element => {
      if (react.getOwnerInstance(element)) {
        react.getOwnerInstance(element).forceUpdate();
      }
    });
  }
};
