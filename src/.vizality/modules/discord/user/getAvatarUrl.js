const { string: { isValidUrl }, logger: { error } } = require('@utilities');

const getUser = require('./getUser');

const getAvatarUrl = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getAvatarUrl';

  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  const avatarURL = getUser(userId).avatarURL || null;

  if (avatarURL && !isValidUrl(avatarURL) && avatarURL.startsWith('/')) {
    return window.location.origin + avatarURL;
  }

  return avatarURL;
};

module.exports = getAvatarUrl;
