const { logger: { error } } = require('@utilities');

const getActivities = require('./getActivities');

const Constants = require('../../modules/constants');

const hasActivityOfType = (userId, ...activityTypes) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasActivityOfType';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  const { ActivityTypes } = Constants;

  if (!activityTypes && activityTypes !== 'number') {
    return error(_module, _submodule, null, `No activity type specified. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
  }

  const UserActivities = getActivities(userId);

  if (!UserActivities && !UserActivities.length) {
    return;
  }

  const userActivityTypes = [];

  for (const activity of UserActivities) {
    userActivityTypes.push(activity.type);
  }

  let hasTypes;

  for (let activity of activityTypes) {
    if (typeof activity !== 'string' && typeof activity !== 'number') {
      return error(_module, _submodule, null, `Activity type must be a string or number. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
    }

    if (Object.values(ActivityTypes).includes(typeof activity === 'string' ? activity.toUpperCase() : activity)) {
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
