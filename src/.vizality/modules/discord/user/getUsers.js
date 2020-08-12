const { getModule } = require('@webpack');

/**
 * Gets all of the cached user data objects.
 *
 * @returns {object} Cached user objects
 */
const getUsers = () => {
  try {
    const Users = getModule('getUser', 'getUsers').getUsers();

    return Users;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUsers;
