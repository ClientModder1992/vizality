const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

/**
 * Gets the user's username.
 * If no user ID is specified, tries to get the avatar string of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User username or undefined
 */
const getUsername = (userId = '') => {
  const _submodule = 'Discord:User:getUsername';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const { username } = getUser(userId);
    return username;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUsername;
