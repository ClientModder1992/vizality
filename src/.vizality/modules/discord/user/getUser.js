const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getValidId = require('../utilities/getValidId');

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
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const User = getModule('getUser', 'getUsers').getUser(userId);

    return User;
  } catch (err) {
    return error(_module, _submodule, null, `User with ID '${userId}' not found. The ID is either invalid or the user is not yet cached.`);
  }
};

module.exports = getUser;
