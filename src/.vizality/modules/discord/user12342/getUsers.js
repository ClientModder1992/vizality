const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

/**
 * Gets all of the currently cached user objects.
 * @returns {Collection<snowflake, User>} All cached user objects
 */
const getUsers = () => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUsers';

  try {
    const UserModule = getModule('getUser', 'getUsers');
    return UserModule.getUsers();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getUsers;
