const Constants = require('../modules/constants');

const getUser = require('./getUser');

/**
 * Checks if the user is a Discord Partner. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isPartner = (userId = '') => {
  if (!userId) {
    return getUser().hasFlag(Constants.UserFlags.PARTNER);
  }

  return getUser(userId).hasFlag(Constants.UserFlags.PARTNER);
};

module.exports = isPartner;
