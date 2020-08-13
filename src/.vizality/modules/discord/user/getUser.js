const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getValidId = require('../utility/getValidId');
const isValidId = require('../utility/isValidId');

/**
 * Gets a user's data object.
 * If no user ID is specified, tries to get the data object of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {(object|undefined)} User object or undefined
 */
const getUser = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUser';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const UserModule = getModule('getUser', 'getUsers');
    const User = UserModule.getUser(userId);
    return User || error(_module, _submodule, null, `User with ID '${userId}' not found. The ID is either invalid or the user is not yet cached.`);
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUser;
