const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

/**
 * Checks if the user's account is a bot account.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a bot
 */
const isBot = (userId = '') => {
  const _submodule = 'Discord:User:isBot';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const { isBot } = getUser(userId);

    return isBot;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isBot;
