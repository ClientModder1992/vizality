const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

/**
 * Checks if the user's account is a verified bot.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is a verified bot
 */
const isVerifiedBot = (userId = '') => {
  const _submodule = 'Discord:User:isVerifiedBot';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is now a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isVerifiedBot = getUser(userId).isVerifiedBot();
    return Boolean(isVerifiedBot);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isVerifiedBot;
