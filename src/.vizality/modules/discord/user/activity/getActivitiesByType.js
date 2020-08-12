const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');
const getActivities = require('./getActivities');

const Constants = require('../../modules/constants');

const getActivitiesByType = (userId, activityType = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getActivitiesByType';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  if (!activityType && typeof activityType !== 'number') {
    return error(_module, _submodule, null, `No activity type specified. Here's a list of valid activity types:\n`, Object.values(ActivityTypes));
  }

  if (!hasActivityOfType(userId, activityType)) {
    return;
  }

  const UserActivities = getActivities(userId);

  const userActivitiesOfType = [];

  if (Object.values(ActivityTypes).includes(typeof activityType === 'string' ? activityType.toUpperCase() : activityType)) {
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
    if (activity && String(activity.type) && String(activity.type) === String(activityType)) {
      userActivitiesOfType.push(activity);
    }
  }

  if (!userActivitiesOfType || !userActivitiesOfType.length) {
    return;
  }

  if (userActivitiesOfType.length === 1) {
    return userActivitiesOfType[0];
  }

  return userActivitiesOfType;
};

module.exports = getActivitiesByType;
