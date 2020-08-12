const { getModule } = require('@webpack');

/**
 * Gets all of the cached user IDs.
 *
 * @returns {Array} Cached user IDs
 */
const getUserIds = () => {
  try {
    const UserIds = getModule('getUserIds').getUserIds();

    return UserIds;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUserIds;
