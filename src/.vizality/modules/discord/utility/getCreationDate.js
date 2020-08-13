/**
 * Gets the creation date/time for the specified ID.
 *
 * @param {string} id - ID
 * @returns {string} Creation date in local string format
 */
const getCreationDate = (id) => {
  // Discord epoch (2015-01-01T00:00:00.000Z)
  const EPOCH = 1420070400000;

  /*
   * Not sure what the number 4194304 is exactly. Used it from https://github.com/vegeta897/snow-stamp
   * If anyone reads this and has an idea how it was obtained, let me know.
   */
  return new Date((id / 4194304) + EPOCH).toLocaleString();
};

module.exports = getCreationDate;
