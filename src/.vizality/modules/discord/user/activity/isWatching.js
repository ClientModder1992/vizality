const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utilities/getValidId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user is currently watching something.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has a watching activity
 */
const isWatching = (userId = '') => {
  const _submodule = 'Discord:User:Activity:isWatching';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  const { ActivityTypes } = Constants;

  try {
    const isWatching = hasActivityOfType(userId, ActivityTypes.WATCHING);
    return Boolean(isWatching);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isWatching;
