import { webFrame } from 'electron';
import { log, warn, error } from './Logger';

const _module = 'Util';
const _submodule = 'React';

/** @private */
const _log = (...data) => {
  log({ module: _module, submodule: _submodule }, ...data);
};

/** @private */
const _error = (...data) => {
  error({ module: _module, submodule: _submodule }, ...data);
};

/**
 * @module util.react
 * @namespace util.react
 * @memberof util
 * @version 0.0.1
 */

/**
 * Finds a value, subobject, or array from a tree that matches a specific filter.
 * @copyright MIT License - (c) 2018 Zachary Rauen, modified by Kyza
 * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/utilities.js#L140}
 * @param {object} tree Tree that should be walked
 * @param {Function} filter Filter to check against each object and subobject
 * @param {object} options Additional options to customize the search
 * @param {Array<string>|null} [options.walkable=[]] Array of strings to use as keys
 * that are allowed to be walked on. Null value indicates all keys are walkable
 * @param {Array<string>} [options.ignore=[]] Array of strings to use as keys to exclude
 * from the search, most helpful when `walkable = null`
 * @param {boolean} [options.whileLoop=false] Whether or not to use a while loop instead of recursion. This is slower, but not prone to stack overflow.
 * @returns {Node|undefined}
 */
export const findInTree = (tree, filter, { walkable = null, ignore = [] } = {}) => {
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
      returnValue = this.findInTree(value, filter, {
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

      returnValue = this.findInTree(tree[key], filter, {
        walkable,
        ignore
      });

      if (returnValue) {
        return returnValue;
      }
    }
  }

  return returnValue;
};

/**
 * Finds a value, subobject, or array from a tree that matches a specific filter. Great
 * for patching render functions.
 * @copyright MIT License - (c) 2018 Zachary Rauen
 * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/utilities.js#L128}
 * @param {object} tree React tree to look through. Can be a rendered object or an internal instance
 * @param {Function} searchFilter Filter function to check subobjects against
 * @returns {Node|undefined}
 */
export const findInReactTree = (tree, searchFilter, whileLoop = false) => {
  return this.findInTree(tree, searchFilter, {
    walkable: [ 'props', 'children', 'child', 'sibling' ],
    whileLoop
  });
};

let i = 0;
export const getReactInstance = node => {
  i++;
  node?.setAttribute('vz-react-instance', i);
  const elem = webFrame.top.context.document.querySelector(
    `[vz-react-instance="${i}"]`
  );
  node?.removeAttribute('vz-react-instance');
  return elem[
    Object.keys(elem).find(
      (key) =>
        key.startsWith('__reactInternalInstance') ||
        key.startsWith('__reactFiber')
    )
  ];
};

const RealHTMLElement = webFrame.top.context.HTMLElement;

export const getOwnerInstance = (node) => {
  for (let curr = this.getReactInstance(node); curr; curr = curr.return) {
    const owner = curr.stateNode;
    if (owner && !(owner instanceof RealHTMLElement)) {
      return owner;
    }
  }

  return null;
};

export const forceUpdateElement = (query, all = false) => {
  const elements = all
    ? [ ...document.querySelectorAll(query) ]
    : [ document.querySelector(query) ];
  return elements.filter(Boolean).forEach((element) => {
    if (this.getOwnerInstance(element)) {
      this.getOwnerInstance(element).forceUpdate();
    }
  });
};
