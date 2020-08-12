const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

const Constants = require('../modules/constants');

/**
 * Checks if the user is a Discord partner.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a Discord partner
 */
const isPartner = (userId = '') => {
  const _submodule = 'Discord:User:isPartner';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const isPartner = getUser(userId).hasFlag(Constants.UserFlags.PARTNER);

    return isPartner;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isPartner;
