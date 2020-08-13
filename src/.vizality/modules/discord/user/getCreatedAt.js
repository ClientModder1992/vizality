const getCreationDate = require('../utility/getCreationDate');
const getValidId = require('../utility/getValidId');
const isValidId = require('../utility/isValidId');

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

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const CreationDate = getCreationDate(userId);
    return CreationDate;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getCreatedAt;
