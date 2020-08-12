const { getModule } = require('@webpack');

const getUser = require('./getUser');

const hasAnimatedAvatar = (userId = '') => {
  const HasAnimatedAvatar = getModule('hasAnimatedAvatar').hasAnimatedAvatar;

  if (!userId) {
    if (!HasAnimatedAvatar(getUser())) {
      return false;
    }
  }

  if (!HasAnimatedAvatar(getUser(userId))) {
    return false;
  }

  return true;
};

module.exports = hasAnimatedAvatar;
