const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentUserId = require('./getCurrentUserId');

/**
 * Gets a user's data object. If no user ID is specified,
 * tries to get the data object of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {object} User data object
 */
const getUser = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUser';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // If no user ID specified, use the current user's
  if (!userId) {
    userId = getCurrentUserId();

    /*
     * Check if there is a current user ID... not sure why/when there wouldn't be
     * but better safe than sorry
     */
    if (!userId) {
      return error(_module, _submodule, null, 'You did not specify a user ID and no current user ID was found.');
    }
  }

  const User = getModule('getUser', 'getUsers').getUser(userId);

  // Check if the user object exists
  if (!User) {
    return error(_module, _submodule, null, `User with ID '${userId}' not found. The ID is either invalid or the user is not yet cached.`);
  }

  return User;
};

module.exports = getUser;
