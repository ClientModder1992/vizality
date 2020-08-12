const getUser = require('./getUser');

const hasAvatar = (userId = '') => {
  if (!userId) {
    if (!getUser().avatar) {
      return false;
    }
  }

  if (!getUser(userId).avatar) {
    return false;
  }

  return true;
};

module.exports = hasAvatar;
