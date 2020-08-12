const Constants = require('../modules/constants');

const getUser = require('./getUser');

const isVerifiedBotDev = (userId = '') => {
  if (!userId) {
    return getUser().hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
  }

  return getUser(userId).hasFlag(Constants.UserFlags.VERIFIED_DEVELOPER);
};

module.exports = isVerifiedBotDev;
