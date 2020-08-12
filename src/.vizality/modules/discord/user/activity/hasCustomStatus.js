const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

const hasCustomStatus = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasCustomStatus';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const hasCustomStatus = hasActivityOfType(userId, ActivityTypes.CUSTOM_STATUS);

  return hasCustomStatus;
};

module.exports = hasCustomStatus;
