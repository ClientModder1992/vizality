const { logger: { error } } = require('@utilities');

const getActivitiesByType = require('./getActivitiesByType');
const hasActivityOfType = require('./hasActivityOfType');

// @todo Change activityType to ...activityTypes to allow filtering for multiple types

/**
 * Gets a user's first occurrence of a specified activity by its type.
 * If no user ID is specified, tries to get the specified activity
 * by its type of the current user.
 *
 * @param {string} userId - User ID
 * @param {(string|number)} activityType - Activity type
 * @returns {object|void} User activity object
 */
const getPrimaryActivityByType = (userId, activityType) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getPrimaryActivityByType';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // Check if the user has any activities of the specified type
  if (!hasActivityOfType(userId, activityType)) {
    return;
  }

  const Activity = getActivitiesByType(userId, activityType)[0];

  return Activity;
};

module.exports = getPrimaryActivityByType;
