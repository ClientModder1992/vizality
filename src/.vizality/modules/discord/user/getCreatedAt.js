const getCreationDate = require('../utilities/getCreationDate');
const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');

/**
 * Gets the user's creation date/time.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User creation date timestamp in local string format
 */
const getCreatedAt = (userId = '') => {
  const _submodule = 'Discord:User:getCreatedAt';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is now a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const CreationDate = getCreationDate(userId);
    return CreationDate;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getCreatedAt;
