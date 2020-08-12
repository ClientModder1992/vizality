const Constants = require('../modules/constants');

const getUser = require('./getUser');

const isBugHunter = (userId = '') => {
  if (!userId) {
    if (getUser().hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1)) {
      return true;
    }

    if (getUser().hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2)) {
      return true;
    }

    return false;
  }

  if (getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_1)) {
    return true;
  }

  if (getUser(userId).hasFlag(Constants.UserFlags.BUG_HUNTER_LEVEL_2)) {
    return true;
  }

  return false;
};

module.exports = isBugHunter;
