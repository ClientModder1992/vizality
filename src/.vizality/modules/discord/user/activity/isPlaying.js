const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

const isPlaying = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isPlaying';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const isPlaying = hasActivityOfType(userId, ActivityTypes.PLAYING);

  return isPlaying;
};

module.exports = isPlaying;
