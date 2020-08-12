const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

const isStreaming = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isStreaming';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const isStreaming = hasActivityOfType(userId, ActivityTypes.STREAMING);

  return isStreaming;
};

module.exports = isStreaming;
