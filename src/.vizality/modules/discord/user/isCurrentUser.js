const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

/**
 * Checks if the user is the current user.
 * If no user ID is specified, it should always return true.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is the current user
 */
const isCurrentUser = (userId = '') => {
  const _submodule = 'Discord:User:isCurrentUser';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const isCurrentUser = getUser(userId).verified;

    return isCurrentUser;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isCurrentUser;
