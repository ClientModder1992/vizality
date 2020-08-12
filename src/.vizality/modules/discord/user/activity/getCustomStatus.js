const { logger: { error } } = require('@utilities');

const getActivitiesByType = require('./getActivitiesByType');
const hasCustomStatus = require('./hasCustomStatus');

const Constants = require('../../modules/constants');

const getCustomStatus = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:getCustomStatus';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!hasCustomStatus(userId)) {
    return false;
  }

  const { ActivityTypes } = Constants;

  const CustomStatus = getActivitiesByType(userId, ActivityTypes.CUSTOM_STATUS);

  return CustomStatus;
};

module.exports = getCustomStatus;
