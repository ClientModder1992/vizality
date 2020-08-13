const getValidId = require('../utility/getValidId');
const isValidId = require('../utility/isValidId');
const getUser = require('./getUser');

const Constants = require('../modules/constants');

/**
 * Checks if the user is a verified bot developer.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user a verified bot developer?
 */
const isVerifiedBotDev = (userId = '') => {
  const _submodule = 'Discord:User:isVerifiedBotDev';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isVerifiedBotDev = getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
    return Boolean(isVerifiedBotDev);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isVerifiedBotDev;
