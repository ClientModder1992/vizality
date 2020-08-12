const getUser = require('./getUser');

/**
 * Checks if the user is the current user. If no user ID is specified,
 * it should always return true.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isCurrentUser = (userId = '') => {
  if (!userId) {
    return getUser().verified;
  }

  return getUser(userId, 'verified');
};

module.exports = isCurrentUser;
