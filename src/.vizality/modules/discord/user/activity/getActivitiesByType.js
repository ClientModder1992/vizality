const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const isValidId = require('../../utility/isValidId');
const getActivities = require('./getActivities');

const Constants = require('../../modules/constants');

/*
 * @todo Change activityType to ...activityTypes to allow filtering for multiple types.
 * @todo Clean up this file.
 */

/**
 * Gets a user's current activities.
 * If no user ID is specified, tries to get the activities of the current user.
 *
 * @param {string} userId - User ID
 * @param {(string|number)} [activityType] - Activity type
 * @returns {(Array|object|undefined)} User activities
 */
const getActivitiesByType = (userId, activityType = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getActivitiesByType';

  // Checks if user ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  const { ActivityTypes } = Constants;

  // Check if any activity types were specified
  if (!activityType && typeof activityType !== 'number') {
    return error(_module, _submodule, null, `No activity type specified. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
  }

  // Check if the user has any activities of the specified type
  if (!hasActivityOfType(userId, activityType)) {
    return;
  }

  const UserActivities = getActivities(userId);

  const userActivitiesOfType = [];

  // If it's a string value, let's convert it over to the corresponding number value
  if (Object.values(ActivityTypes).includes(typeof activityType === 'string' ? activityType.toUpperCase() : activityType)) {
    // If activity is a string value, compare all uppercase, else just use activity
    switch (typeof activityType === 'string' ? activityType.toUpperCase() : activityType) {
      case 'PLAYING':
        activityType = 0;
        break;
      case 'STREAMING':
        activityType = 1;
        break;
      case 'LISTENING':
        activityType = 2;
        break;
      case 'WATCHING':
        activityType = 3;
        break;
      case 'CUSTOM_STATUS':
        activityType = 4;
        break;
    }
  } else {
    return error(_module, _submodule, null, `Activity type '${activityType}' not found. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
  }

  for (const activity of UserActivities) {
    /*
     * Darn you, 0 and 1 number values... Convert to strings to prevent them from
     * getting interpreted as booleans.
     */
    if (activity && String(activity.type) && String(activity.type) === String(activityType)) {
      userActivitiesOfType.push(activity);
    }
  }

  // Check if the user has any activities of the specified type
  if (!userActivitiesOfType || !userActivitiesOfType.length) {
    return;
  }

  // Check if the user has exactly 1 activity of the specified type
  if (userActivitiesOfType.length === 1) {
    return userActivitiesOfType[0];
  }

  return userActivitiesOfType;
};

module.exports = getActivitiesByType;
