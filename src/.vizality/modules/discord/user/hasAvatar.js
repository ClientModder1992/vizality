const getUser = require('./getUser');

/**
 * Checks if the user has a non-default avatar. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const hasAvatar = (userId = '') => {
  if (!userId) {
    if (!getUser().avatar) {
      return false;
    }
  }

  if (!getUser(userId).avatar) {
    return false;
  }

  return true;
};

module.exports = hasAvatar;
