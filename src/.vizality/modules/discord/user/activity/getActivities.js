const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentUserId = require('../getCurrentUserId');

const getActivities = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getActivities';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();
  }

  const Activities = getModule('getPrimaryActivity').getActivities(userId);

  return Activities;
};

module.exports = getActivities;
