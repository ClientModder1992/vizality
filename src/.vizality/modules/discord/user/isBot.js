const getUser = require('./getUser');

/**
 * Checks if the user's account is a bot account. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isBot = (userId = '') => {
  if (!userId) {
    return getUser().bot;
  }

  return getUser(userId, 'bot');
};

module.exports = isBot;
