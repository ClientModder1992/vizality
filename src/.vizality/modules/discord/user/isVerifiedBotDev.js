const Constants = require('../modules/constants');

const getUser = require('./getUser');

/**
 * Checks if the user is a verified bot developer. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isVerifiedBotDev = (userId = '') => {
  if (!userId) {
    return getUser().hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
  }

  return getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
};

module.exports = isVerifiedBotDev;
