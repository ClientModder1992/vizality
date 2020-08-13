const getValidId = require('../../utility/getValidId');
const _isStreaming = require('../activity/isStreaming');
const isValidId = require('../../utility/isValidId');

/**
 * Checks if the user is streaming.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @alias discord.user.activity.isStreaming
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user streaming?
 */
const isStreaming = (userId = '') => {
  const _submodule = 'Discord:User:Status:isStreaming';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isStreaming = _isStreaming(userId);
    return isStreaming;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isStreaming;
