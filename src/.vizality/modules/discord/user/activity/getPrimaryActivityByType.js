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
 * @returns {(object|undefined)} User activity object
 */
const getPrimaryActivityByType = (userId, activityType) => {
  const _submodule = 'Discord:User:Activity:getPrimaryActivityByType';

  // Check if user ID is a string
  if (typeof userId !== 'string') {
    throw new TypeError(`"userId" argument must be a string (received ${typeof userId})`);
  }

  // Check if the user has any activities of the specified type
  if (!hasActivityOfType(userId, activityType)) return;

  try {
    const Activities = getActivitiesByType(userId, activityType);
    return Activities[0];
  } catch (err) {
    // Fail silently
  }
};

module.exports = getPrimaryActivityByType;
