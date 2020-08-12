const Constants = require('../modules/constants');

const getUser = require('./getUser');

/**
 * Checks if the user is a Discord bug hunter. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isBugHunter = (userId = '') => {
  if (!userId) {
    if (getUser().hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1)) {
      return true;
    }

    if (getUser().hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2)) {
      return true;
    }

    return false;
  }

  if (getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1)) {
    return true;
  }

  if (getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2)) {
    return true;
  }

  return false;
};

module.exports = isBugHunter;
