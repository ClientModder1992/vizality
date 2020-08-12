const { getModule } = require('@webpack');

const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

/**
 * Checks if the user has an animated avatar.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has an animated avatar
 */
const hasAnimatedAvatar = (userId = '') => {
  const _submodule = 'Discord:User:hasAnimatedAvatar';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const { hasAnimatedAvatar } = getModule('hasAnimatedAvatar');

    return hasAnimatedAvatar(getUser(userId));
  } catch (err) {
    // Fail silently
  }
};

module.exports = hasAnimatedAvatar;
