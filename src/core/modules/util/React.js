import { webFrame } from "electron";
import * as logger from "./Logger";

/**
 * @module util.react
 * @namespace util.react
 * @memberof util
 * @version 0.0.1
 */

/**
 * Finds a value, subobject, or array from a tree that matches a specific filter.
 * @copyright MIT License - (c) 2018 Zachary Rauen
 * @see {@link https://github.com/rauenzi/BDPluginLibrary/blob/master/src/modules/utilities.js#L140}
 * @param {object} tree Tree that should be walked
 * @param {Function} filter Filter to check against each object and subobject
 * @param {object} options Additional options to customize the search
 * @param {Array<string>|null} [options.walkable=[]] Array of strings to use as keys
 * that are allowed to be walked on. Null value indicates all keys are walkable
 * @param {Array<string>} [options.ignore=[]] Array of strings to use as keys to exclude
 * from the search, most helpful when `walkable = null`
 * @param {object} [options.whileLoop=false] Whether or not to use a while loop instead of recursion. This is slower, but not prone to stack overflow.
 * @returns {Node|undefined}
 */
export const findInTree = (
  tree,
  filter,
  { walkable = [], ignore = [], whileLoop = false, first = true } = {}
) => {
  if (!tree || typeof tree != "object")
    return (
      logger.error(`The specified tree is not an object. Instead got:`, tree),
      null
    );
  if (first) {
    try {
      JSON.stringify(tree);
    } catch {
      return logger.error("Cannot search a circular object."), null;
    }
  }
  if (typeof filter == "string") return tree[filter];

  if (whileLoop) {
    const stack = [tree];
    while (stack.length) {
      const node = stack[whileLoop === "reverse" ? "pop" : "shift"]();
      try {
        if (filter(node)) return node;
      } catch {}
      if (Array.isArray(node)) {
        stack.push(...node);
      } else if (typeof node === "object" && node !== null) {
        if (walkable.length > 0) {
          stack.push(
            ...Object.entries(node)
              .filter(
                ([key, value]) =>
                  walkable.indexOf(key) !== -1 && ignore.indexOf(key) === -1
              )
              .map(([key, value]) => value)
          );
        } else {
          stack.push(
            ...Object.values(node).filter(
              (key) => ignore.indexOf(key) === -1 && node
            )
          );
        }
      }
    }
    return null;
  } else {
    let returnValue;
    try {
      if (filter(tree)) return tree;
    } catch {}
    if (Array.isArray(tree)) {
      for (const value of tree) {
        returnValue = findInTree(value, filter, {
          walkable,
          exclude: ignore,
          whileLoop,
          first: false,
        });
        if (returnValue) return returnValue;
      }
    }
    walkable = walkable || Object.keys(tree);
    for (const key of walkable) {
      if (!tree.hasOwnProperty(key) || ignore.includes(key)) continue;
      returnValue = findInTree(tree[key], filter, {
        walkable,
        exclude: ignore,
        whileLoop,
        first: false,
      });
      if (returnValue) return returnValue;
    }
    return null;
  }
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
    walkable: ["props", "children", "child", "sibling"],
    whileLoop,
  });
};

let i = 0;
export const getReactInstance = (node) => {
  i++;
  node?.setAttribute("vz-react-instance", i);
  const elem = webFrame.top.context.document.querySelector(
    `[vz-react-instance="${i}"]`
  );
  node?.removeAttribute("vz-react-instance");
  return elem[
    Object.keys(elem).find(
      (key) =>
        key.startsWith("__reactInternalInstance") ||
        key.startsWith("__reactFiber")
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
    ? [...document.querySelectorAll(query)]
    : [document.querySelector(query)];
  return elements.filter(Boolean).forEach((element) => {
    if (this.getOwnerInstance(element)) {
      this.getOwnerInstance(element).forceUpdate();
    }
  });
};
