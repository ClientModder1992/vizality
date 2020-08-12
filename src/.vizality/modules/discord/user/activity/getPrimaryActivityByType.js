const { logger: { error } } = require('@utilities');

const getActivitiesByType = require('./getActivitiesByType');
const hasActivityOfType = require('./hasActivityOfType');

const getPrimaryActivityByType = (userId, activityType) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getPrimaryActivityByType';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!hasActivityOfType(userId, activityType)) {
    return;
  }

  const Activity = getActivitiesByType(userId, activityType)[0];

  return Activity;
};

module.exports = getPrimaryActivityByType;
