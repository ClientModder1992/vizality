const isArray = require('./isArray');

/**
 * Checks if the input is an array. If it is, do nothing. If it's not, throw an error.
 * @param {*} input Argument input
 * @returns {void} Whether the input is an array
 */
const assertArray = (input) => {
  /*
   * We're calling the function here, so if it's false, it will throw an error from
   * inside of isArray; if it's true, do nothing
   */
  if (isArray(input, true));
};

module.exports = assertArray;
