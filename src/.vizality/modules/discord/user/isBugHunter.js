const getValidId = require('../utility/getValidId');
const isValidId = require('../utility/isValidId');
const getUser = require('./getUser');

const Constants = require('../modules/constants');

/**
 * Checks if the user is a Discord bug hunter.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Is the user a Discord bug hunter?
 */
const isBugHunter = (userId = '') => {
  const _submodule = 'Discord:User:isBugHunter';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isBugHunterLvl1 = getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1);
    const isBugHunterLvl2 = getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2);
    return Boolean(isBugHunterLvl1 || isBugHunterLvl2);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isBugHunter;
