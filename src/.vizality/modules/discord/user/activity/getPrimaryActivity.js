const { logger: { error } } = require('@utilities');

const getActivities = require('./getActivities');

/**
 * Gets a user's primary activity object. If no user ID is specified, tries
 * to get the primary activity object of the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {object|void} User primary activity object
 */
const getPrimaryActivity = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getPrimaryActivity';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  const Activity = getActivities(userId)[0];

  return Activity;
};

module.exports = getPrimaryActivity;
