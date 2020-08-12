const getUser = require('./getUser');

/**
 * Checks if the user's account is a verified bot account. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isVerifiedBot = (userId = '') => {
  if (!userId) {
    return getUser().isVerifiedBot();
  }

  return getUser(userId).isVerifiedBot();
};

module.exports = isVerifiedBot;
