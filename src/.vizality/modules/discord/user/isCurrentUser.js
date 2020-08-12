const getUser = require('./getUser');

const isCurrentUser = (userId = '') => {
  if (!userId) {
    return getUser().verified;
  }

  return getUser(userId, 'verified');
};

module.exports = isCurrentUser;
