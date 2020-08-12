const { getModule } = require('@webpack');

const getUser = require('./getUser');

/**
 * Checks if the user has an animated avatar. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has an animated avatar
 */
const hasAnimatedAvatar = (userId = '') => {
  const HasAnimatedAvatar = getModule('hasAnimatedAvatar').hasAnimatedAvatar;

  if (!userId) {
    if (!HasAnimatedAvatar(getUser())) {
      return false;
    }
  }

  if (!HasAnimatedAvatar(getUser(userId))) {
    return false;
  }

  return true;
};

module.exports = hasAnimatedAvatar;
