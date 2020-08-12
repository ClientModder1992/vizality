const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getTag = require('./getTag');

const getUserByTag = (userTag = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUserByTag';

  if (typeof userTag !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  if (!userTag) {
    userTag = getTag();
  }

  const username = userTag.slice(0, -5);
  const discriminator = userTag.slice(-4);

  const User = getModule('getUser', 'getUsers').findByTag(username, discriminator);

  if (!User) {
    return error(_module, _submodule, null, `User with tag '${userTag}' not found. The tag is either invalid or the user is not yet cached.`);
  }

  return User;
};

module.exports = getUserByTag;
