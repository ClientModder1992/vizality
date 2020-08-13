const getValidId = require('../utility/getValidId');
const isValidId = require('../utility/isValidId');
const getUser = require('./getUser');

/**
 * Checks if the user's account is a bot account.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Is the user a bot?
 */
const isBot = (userId = '') => {
  const _submodule = 'Discord:User:isBot';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  console.log(userId);

  try {
    const { bot } = getUser(userId);
    return Boolean(bot);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isBot;
