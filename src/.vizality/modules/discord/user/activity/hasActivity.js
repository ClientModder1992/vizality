const { logger: { error } } = require('@utilities');

const getPrimaryActivity = require('./getPrimaryActivity');

const hasActivity = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasActivity';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (getPrimaryActivity(userId)) {
    return true;
  }

  return false;
};

module.exports = hasActivity;
