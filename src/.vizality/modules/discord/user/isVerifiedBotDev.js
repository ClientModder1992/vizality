const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

const Constants = require('../modules/constants');

/**
 * Checks if the user is a verified bot developer.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a verified bot developer
 */
const isVerifiedBotDev = (userId = '') => {
  const _submodule = 'Discord:User:isVerifiedBotDev';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const isVerifiedBotDev = getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);

    return isVerifiedBotDev;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isVerifiedBotDev;
