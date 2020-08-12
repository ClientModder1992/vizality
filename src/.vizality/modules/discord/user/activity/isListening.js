const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

const isListening = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:isListening';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const isListening = hasActivityOfType(userId, ActivityTypes.LISTENING);

  return isListening;
};

module.exports = isListening;
