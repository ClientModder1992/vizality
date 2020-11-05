const { logger: { error } } = require('@vizality/util');

const getPrimaryActivity = require('./getPrimaryActivity');
const getCurrentUserId = require('../getCurrentUserId');

/**
 * Checks if a user has a certain activity.
 * If no user ID is provided, tries to use the current user.
 * @memberof discord.user.activity
 * @param {snowflake} [userId] User ID
 * @returns {boolean} Whether the user hs an activity present
 */
const hasActivity = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasActivity';

  // If no user ID is provided, try to use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const PrimaryActivity = getPrimaryActivity(userId);
    return Boolean(PrimaryActivity);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = hasActivity;
