/* eslint-disable no-unused-vars */

/**
 * A simple utility for conditionally joining class names together.
 * @see {@link https://github.com/JedWatson/classnames}
 * @param {string|object|Array} items Potential class names we're trying to join
 * @returns {string} String of class names joined together
 */
const joinClassNames = module.exports = (...items) => {
  const classes = [];
  for (const item of items) {
    if (!item) continue;
    const argType = typeof item;
    if (argType === 'string' || argType === 'number') {
      classes.push(item);
    } else if (Array.isArray(item)) {
      if (item.length) {
        const inner = this.joinClassNames.apply(null, item);
        if (inner) classes.push(inner);
      }
    } else if (argType === 'object') {
      if (item.toString !== Object.prototype.toString) {
        classes.push(item.toString());
      } else {
        for (const key in item) {
          if (item.hasOwnProperty(key) && item[key]) {
            classes.push(key);
          }
        }
      }
    }
  }
  return classes.join(' ');
};
