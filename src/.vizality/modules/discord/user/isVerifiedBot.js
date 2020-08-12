const getUser = require('./getUser');

const isVerifiedBot = (userId = '') => {
  if (!userId) {
    return getUser().isVerifiedBot();
  }

  return getUser(userId).isVerifiedBot();
};

module.exports = isVerifiedBot;
