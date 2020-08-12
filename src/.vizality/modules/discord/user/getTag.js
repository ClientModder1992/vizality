const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

const getTag = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getTag';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  return getUser(userId).tag;
};

module.exports = getTag;
