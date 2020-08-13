const classNames = require('classnames');

/**
 * A simple utility for conditionally joining class names together.
 *
 * @see {@link https://github.com/JedWatson/classnames}
 * @param {(string|object)} args Class name
 * @returns {string} String of class names joined together
 */
const joinClassNames = (...args) => {
  return classNames(...args);
};

module.exports = joinClassNames;
