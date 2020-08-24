const Object = require('./Object');
const Array = require('./Array');
const Type = require('./Type');

/**
 * @module Util.React
 * @namespace Util.React
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class React {
  /**
   * Finds a value, subobject, or array from a tree that matches a specific filter. Great
   * for patching render functions.
   * @copyright MIT License - (c) 2018 Zachary Rauen
   * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/utilities.js#L128}
   * @param {Object} tree React tree to look through. Can be a rendered object or an internal instance
   * @param {Function} searchFilter Filter function to check subobjects against
   * @returns {Node|undefined}
   */
  static findInReactTree (tree, searchFilter) {
    return this.findInTree(tree, searchFilter, { walkable: [ 'props', 'children', 'child', 'sibling' ] });
  }

  /**
   * Finds a value, subobject, or array from a tree that matches a specific filter.
   * @copyright MIT License - (c) 2018 Zachary Rauen
   * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/utilities.js#L140}
   * @param {Object} tree Tree that should be walked
   * @param {Function} searchFilter Filter to check against each object and subobject
   * @param {Object} options Additional options to customize the search
   * @param {Array<string>|null} [options.walkable=null] Array of strings to use as keys
   * that are allowed to be walked on. Null value indicates all keys are walkable
   * @param {Array<string>} [options.ignore=[]] Array of strings to use as keys to exclude
   * from the search, most helpful when `walkable = null`
   * @returns {Node|undefined}
   */
  static findInTree (tree, searchFilter, { walkable = null, ignore = [] } = {}) {
    if (typeof searchFilter === 'string') {
      if (tree.hasOwnProperty(searchFilter)) return tree[searchFilter];
    } else if (searchFilter(tree)) {
      return tree;
    }

    if (!Object.isObject(tree) || Type.isNull(tree)) return undefined;

    let tempReturn;
    if (Array.isArray(tree)) {
      for (const value of tree) {
        tempReturn = this.findInTree(value, searchFilter, { walkable, ignore });
        if (typeof tempReturn !== 'undefined') return tempReturn;
      }
    } else {
      const toWalk = walkable === null ? Object.keys(tree) : walkable;
      for (const key of toWalk) {
        if (!tree.hasOwnProperty(key) || ignore.includes(key)) continue;
        tempReturn = this.findInTree(tree[key], searchFilter, { walkable, ignore });
        if (typeof tempReturn !== 'undefined') return tempReturn;
      }
    }
    return tempReturn;
  }

  static forceUpdateElement (query, all = false) {
    const elements = all ? [ ...document.querySelectorAll(query) ] : [ document.querySelector(query) ];
    return elements.filter(Boolean).forEach(element => {
      this.getOwnerInstance(element).forceUpdate();
    });
  }

  static getReactInstance (node) {
    if (!node) return null;
    if (!Object.keys(node) || !Object.keys(node).length) return null;
    const reactInternalInstanceKey = Object.keys(node).find(key => key.startsWith('__reactInternalInstance'));
    return reactInternalInstanceKey ? node[reactInternalInstanceKey] : null;
  }

  static getOwnerInstance (node) {
    for (let currentNode = this.getReactInstance(node); currentNode; currentNode = currentNode.return) {
      const owner = currentNode.stateNode;
      if (owner && !(owner instanceof HTMLElement)) return owner;
    }
    return null;
  }
};
