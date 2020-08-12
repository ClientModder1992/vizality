const getValidId = require('../../utilities/getValidId');
const _isStreaming = require('../activity/isStreaming');

/**
 * Checks if the user is streaming.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @alias discord.user.activity.isStreaming
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is streaming or not
 */
const isStreaming = (userId = '') => {
  const _submodule = 'Discord:User:Status:isStreaming';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const isStreaming = _isStreaming(userId);
    return isStreaming;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isStreaming;
