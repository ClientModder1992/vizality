const Constants = require('../modules/constants');

const getUser = require('./getUser');

const isPartner = (userId = '') => {
  if (!userId) {
    return getUser().hasFlag(Constants.UserFlags.PARTNER);
  }

  return getUser(userId).hasFlag(Constants.UserFlags.PARTNER);
};

module.exports = isPartner;
