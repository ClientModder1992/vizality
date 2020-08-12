const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

const Constants = require('../modules/constants');

/**
 * Checks if the user is a Discord bug hunter.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a Discord bug hunter
 */
const isBugHunter = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isBugHunter';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    let isBugHunter = getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1);

    if (!isBugHunter) {
      isBugHunter = getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2)
    }

    return isBugHunter;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isBugHunter;
