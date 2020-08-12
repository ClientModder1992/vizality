const { logger: { error } } = require('@utilities');

const getCreationDate = require('../utilities/getCreationDate');
const getCurrentUserId = require('./getCurrentUserId');

const getCreatedAt = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getCreatedAt';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userId) {
    userId = getCurrentUserId();

    if (!userId) {
      return error(_module, _submodule, null, 'You did not specify a user ID and no current user ID was found.');
    }
  }

  return getCreationDate(userId);
};

module.exports = getCreatedAt;
