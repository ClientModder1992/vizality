const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

/**
 * Checks if the user's account is a verified bot.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a verified bot
 */
const isVerifiedBot = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isVerifiedBot';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  try {
    const isVerifiedBot = getUser(userId).isVerifiedBot();

    return isVerifiedBot;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isVerifiedBot;
