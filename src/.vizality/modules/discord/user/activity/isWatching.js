const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user is currently watching something.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user watching something?
 */
const isWatching = (userId = '') => {
  const _submodule = 'Discord:User:Activity:isWatching';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  const { ActivityTypes } = Constants;

  try {
    const isWatching = hasActivityOfType(userId, ActivityTypes.WATCHING);
    return Boolean(isWatching);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isWatching;
