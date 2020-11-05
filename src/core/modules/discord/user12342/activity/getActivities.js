const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const getCurrentUserId = require('../getCurrentUserId');

/**
 * Gets a user's current activities.
 * If no user ID is specified, tries to get the activities of the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {?Array|undefined} User activities
 */
const getActivities = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getActivities';

  try {
    // If no user ID is provided, use the current user's ID
    userId = userId || getCurrentUserId();

    const ActivitiesModule = getModule('getPrimaryActivity');

    return ActivitiesModule.getActivities(userId);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getActivities;
