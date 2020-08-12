const getCreationDate = require('../utilities/getCreationDate');
const getValidId = require('../utilities/getValidId');

/**
 * Gets the user's creation date/time.
 *
 * @param {string} [userId] - User ID
 * @returns {string} User creation date timestamp in local string format
 */
const getCreatedAt = (userId = '') => {
  const _submodule = 'Discord:User:getCreatedAt';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const CreationDate = getCreationDate(userId);

    return CreationDate;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getCreatedAt;
