const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

/**
 * Gets the user's avatar string.
 * If no user ID is specified, tries to get the avatar string of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(string|undefined)} User avatar string or undefined
 */
const getAvatarString = (userId = '') => {
  const _submodule = 'Discord:User:getAvatarString';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const { avatar } = getUser(userId);

    return avatar;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getAvatarString;
