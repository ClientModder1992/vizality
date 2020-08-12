const { logger: { error } } = require('@utilities');

const getActivities = require('./getActivities');

const getPrimaryActivity = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getPrimaryActivity';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  const Activity = getActivities(userId)[0];

  return Activity;
};

module.exports = getPrimaryActivity;
