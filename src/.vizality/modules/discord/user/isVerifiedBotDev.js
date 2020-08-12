const { logger: { error } } = require('@utilities');

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
  const _module = 'Module';
  const _submodule = 'Discord:User:isVerifiedBotDev';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const isVerifiedBotDev = getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);

    return isVerifiedBotDev;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isVerifiedBotDev;
