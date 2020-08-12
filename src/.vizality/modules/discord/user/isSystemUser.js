const getUser = require('./getUser');

/**
 * Checks if the user's account is a system account. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isSystemUser = (userId = '') => {
  if (!userId) {
    return getUser().isSystemUser();
  }

  return getUser(userId).isSystemUser();
};

module.exports = isSystemUser;
