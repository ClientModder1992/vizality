const { logger: { error } } = require('@util');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

/**
 * Checks if a user's account is a bot account.
 * If no user ID is provided, tries to use the current user.
 * @param {snowflake} [userId] User ID
 * @returns {boolean} Whether the user is a bot
 */
const isBot = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isBot';

  console.log(this.arguments);

  try {
    // If no user ID is provided, try to use the current user's ID
    if (undefined) {
      userId = getCurrentUserId();
    }

    // Check if user ID is a string
    if (userId && typeof userId !== 'string') {
      // Check if user ID is null, because typeof null is 'object' in Javascript...
      throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
    }

    const User = getUser(userId);

    // If no user is returned
    if (!User) {
      throw new Error(`User with ID "${userId}" not found. Either the ID is invalid or the user is not cached.`);
    }

    return User.bot;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isBot;
