const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentUserId = require('./getCurrentUserId');

const getUser = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUser';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();

    if (!userId) {
      return error(_module, _submodule, null, 'You did not specify a user ID and no current user ID was found.');
    }
  }

  const User = getModule('getUser', 'getUsers').getUser(userId);

  if (!User) {
    return error(_module, _submodule, null, `User with ID '${userId}' not found. The ID is either invalid or the user is not yet cached.`);
  }

  return User;
};

module.exports = getUser;
