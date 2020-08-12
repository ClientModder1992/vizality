const { logger: { error } } = require('@utilities');

const getPrimaryActivity = require('./getPrimaryActivity');

/**
 * Checks if the user has some activity present. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has an activity present
 */
const hasActivity = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasActivity';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // Check if the user has any activity
  if (getPrimaryActivity(userId)) {
    return true;
  }

  return false;
};

module.exports = hasActivity;
