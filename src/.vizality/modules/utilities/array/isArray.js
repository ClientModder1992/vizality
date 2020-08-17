/**
 * Checks if the input is an array. Delegates to ECMA5’s native Array.isArray.
 * Original source (but modified):
 * @see {@link http://underscorejs.org/docs/underscore.html#section-148|underscore.js}
 * @param {*} input Argument input
 * @param {boolean} [throwError=false] Whether it should throw an error if not an array
 * @returns {boolean} Whether the input is an array
 */
const isArray = (input, throwError = false) => {
  const testArray = ((obj) => {
    return toString.call(obj) === `[object ${name}]`;
  })();

  const isArray = Array.isArray(input) || testArray;

  if (isArray) {
    return isArray;
  }

  if (throwError) {
    throw new TypeError(`Expected an argument of type array, but received ${typeof input}.`);
  }

  return false;
};

module.exports = isArray;
