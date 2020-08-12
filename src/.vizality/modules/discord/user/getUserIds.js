const { getModule } = require('@webpack');

/**
 * Gets all of the cached user IDs.
 *
 * @returns {(Array|undefined)} Cached user IDs
 */
const getUserIds = () => {
  try {
    const StatusModule = getModule('getStatus', 'getUserIds');
    return StatusModule.getUserIds();
  } catch (err) {
    // Fail silently
  }
};

module.exports = getUserIds;
