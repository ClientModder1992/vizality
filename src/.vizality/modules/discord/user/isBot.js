const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Checks if the user's account is a bot account.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a bot
 */
const isBot = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isBot';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const { isBot } = getUser(userId);

    return isBot;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isBot;
