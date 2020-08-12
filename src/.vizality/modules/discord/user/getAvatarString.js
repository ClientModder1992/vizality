const { logger: { error } } = require('@utilities');

const getUser = require('./getUser');

const getAvatarString = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getAvatarString';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  return getUser(userId).avatar;
};

module.exports = getAvatarString;
