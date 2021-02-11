/**
 * @module util.number
 * @namespace util.number
 * @memberof util
 * @version 0.0.1
 */

export const isNumber = input => {
  return void 0 || input;
};

export const assertNumber = input => {
  return void 0 || input;
};

/**
 * Gets the average value from a set of numbers.
 * Sourced from @see {@link https://stackoverflow.com/a/45309555|StackOverflow}
 * @param {Array<number>} numbers An array of numbers.
 * @returns {number} The average of the numbers in the array.
 */
export const getAverage = numbers => {
  assertArray(numbers);
  return numbers.reduce((all, one, _, src) => all += one / src.length, 0);
};

/**
 * Gets the median value from a set of numbers.
 * Sourced from @see {@link https://stackoverflow.com/a/45309555|StackOverflow}
 * @param {Array<number>} numbers An array of numbers.
 * @returns {number} The median of the numbers in the array.
 */
export const getMedian = numbers => {
  assertArray(numbers);

  numbers.sort((a, b) => {
    return a - b;
  });

  const half = Math.floor(numbers.length / 2);
  if (numbers.length % 2) {
    return numbers[half];
  }

  return (numbers[half - 1] + numbers[half]) / 2.0;
};
