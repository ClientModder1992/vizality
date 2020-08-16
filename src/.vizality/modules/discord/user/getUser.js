const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentUserId = require('./getCurrentUserId');

/**
 * Gets a user object.
 * If no user ID is provided, tries to use the current user.
 * @memberof discord.user
 * @param {snowflake} [userId] The user ID
 * @returns {User|undefined} User object
 */
const getUser = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUser';

  try {
    // If no user ID is provided, try to use the current user's ID
    if (arguments.length === 0) {
      userId = getCurrentUserId();
    }

    // Check if user ID is a string
    if (typeof userId !== 'string') {
      // Check if user ID is null, because typeof null is 'object' in Javascript...
      throw new TypeError(`"userId" argument must be a string (received ${userId === null ? 'null' : typeof userId})`);
    }

    const UserModule = getModule('getUser', 'getUsers');
    const User = UserModule.getUser(userId);

    return User;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getUser;
