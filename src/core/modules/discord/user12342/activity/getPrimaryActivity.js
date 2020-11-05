const { logger: { error } } = require('@vizality/util');

const getCurrentUserId = require('../getCurrentUserId');
const getActivities = require('./getActivities');

/**
 * Gets a user's primary activity object.
 * If no user ID is specified, tries to get the primary activity object of the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {Activity} User primary activity object
 */
const getPrimaryActivity = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getPrimaryActivity';

  try {
    // If no user ID is provided, use the current user's ID
    userId = userId || getCurrentUserId();

    const Activities = getActivities(userId);

    return Activities[0];
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getPrimaryActivity;
