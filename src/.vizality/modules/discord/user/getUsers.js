const { getModule } = require('@webpack');

/**
 * Gets all of the cached user data objects.
 *
 * @returns {(object|undefined)} Cached user objects
 */
const getUsers = () => {
  try {
    const UserModule = getModule('getUser', 'getUsers').getUsers();
    const Users = UserModule.getUsers();
    return Users;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUsers;
