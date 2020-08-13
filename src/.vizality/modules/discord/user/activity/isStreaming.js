const hasActivityOfType = require('./hasActivityOfType');
const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');

const Constants = require('../../module/constants');

/**
 * Checks if the user is currently streaming.
 * If no user ID is specified, tries to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user streaming?
 */
const isStreaming = (userId = '') => {
  const _submodule = 'Discord:User:Activity:isStreaming';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  const { ActivityTypes } = Constants;

  try {
    const isStreaming = hasActivityOfType(userId, ActivityTypes.STREAMING);
    return Boolean(isStreaming);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isStreaming;
