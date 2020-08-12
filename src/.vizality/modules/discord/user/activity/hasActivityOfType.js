const { logger: { error } } = require('@utilities');

const isValidId = require('../../utilities/isValidId');
const getActivities = require('./getActivities');

const Constants = require('../../modules/constants');

/*
 * @todo Clean up this file.
 */

/**
 * Checks if the user currently has the specified activity type(s).
 *
 * @param {string} userId - User ID
 * @param {string|number} activityTypes - Activity type
 * @returns {boolean} Whether the user has the specified activity type(s) present
 */
const hasActivityOfType = (userId, ...activityTypes) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasActivityOfType';

  // Checks if user ID is a valid string
  if (!isValidId(userId, 'user', _submodule)) {
    return;
  }

  const { ActivityTypes } = Constants;

  // Check if any activity types were specified
  if (!activityTypes && activityTypes !== 'number') {
    return error(_module, _submodule, null, `No activity type specified. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
  }

  const UserActivities = getActivities(userId);

  // Check if the user has any activities present
  if (!UserActivities && !UserActivities.length) {
    return;
  }

  const userActivityTypes = [];

  for (const activity of UserActivities) {
    userActivityTypes.push(activity.type);
  }

  let hasTypes;

  // Check if the specified activity type is valid
  for (let activity of activityTypes) {
    // Check if the activity type is a valid string or number
    if (typeof activity !== 'string' && typeof activity !== 'number') {
      return error(_module, _submodule, null, `Activity type must be a string or number. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
    }

    // If it's a string value, let's convert it over to the corresponding number value
    if (Object.values(ActivityTypes).includes(typeof activity === 'string' ? activity.toUpperCase() : activity)) {
      // If activity is a string value, compare all uppercase, else just use activity
      switch (typeof activity === 'string' ? activity.toUpperCase() : activity) {
        case 'PLAYING':
          activity = 0;
          break;
        case 'STREAMING':
          activity = 1;
          break;
        case 'LISTENING':
          activity = 2;
          break;
        case 'WATCHING':
          activity = 3;
          break;
        case 'CUSTOM_STATUS':
          activity = 4;
          break;
      }
    } else {
      return error(_module, _submodule, null, `Activity type '${activity}' not found. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
    }

    // Check if the user has the activity type present
    if (userActivityTypes.includes(activity)) {
      hasTypes = true;
    } else {
      hasTypes = false;
    }

    if (hasTypes === false) {
      break;
    }
  }

  return hasTypes;
};

module.exports = hasActivityOfType;
