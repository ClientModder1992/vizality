const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

/**
 * Checks if the user is the current user.
 * If no user ID is specified, it should always return true.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is the current user
 */
const isCurrentUser = (userId = '') => {
  const _submodule = 'Discord:User:isCurrentUser';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is now a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isCurrentUser = getUser(userId);
    return Boolean(isCurrentUser.verified);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isCurrentUser;
