const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

/**
 * Checks if the user has a non-default avatar.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a bot
 */
const hasAvatar = (userId = '') => {
  const _submodule = 'Discord:User:hasAvatar';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const { avatar } = getUser(userId);

    // Check if avatar is null (users that don't have a custom avatar set)
    if (avatar === null) {
      return false;
    }

    // Check if avatar is falsey (most likely undefined)
    if (!avatar) {
      return;
    }

    return true;
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasAvatar;
