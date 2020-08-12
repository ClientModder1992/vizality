const { logger: { error } } = require('@utilities');

const getCreationDate = require('../utilities/getCreationDate');
const getCurrentUserId = require('./getCurrentUserId');

/**
 * Gets the user's creation date/time.
 *
 * @param {string} [userId] - User ID
 * @returns {string} User creation date timestamp in local string format
 */
const getCreatedAt = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getCreatedAt';

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

  return getCreationDate(userId);
};

module.exports = getCreatedAt;
