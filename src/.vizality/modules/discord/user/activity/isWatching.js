const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

const isWatching = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isWatching';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const isWatching = hasActivityOfType(userId, ActivityTypes.WATCHING);

  return isWatching;
};

module.exports = isWatching;
