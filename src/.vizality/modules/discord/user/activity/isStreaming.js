const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utilities/getValidId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user is currently streaming.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is streaming
 */
const isStreaming = (userId = '') => {
  const _submodule = 'Discord:User:Activity:isStreaming';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  const { ActivityTypes } = Constants;

  try {
    const isStreaming = hasActivityOfType(userId, ActivityTypes.STREAMING);
    return Boolean(isStreaming);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isStreaming;
