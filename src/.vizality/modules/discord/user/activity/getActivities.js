const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentUserId = require('../getCurrentUserId');

/**
 * Gets a user's current activities. If no user ID is specified, tries
 * to get the activities of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {?Array|void} User activities
 */
const getActivities = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getActivities';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // If no user ID specified, use the current user's
  if (!userId) {
    userId = getCurrentUserId();
  }

  const Activities = getModule('getPrimaryActivity').getActivities(userId);

  return Activities;
};

module.exports = getActivities;
