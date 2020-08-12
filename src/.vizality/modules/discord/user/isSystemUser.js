const getUser = require('./getUser');

const isSystemUser = (userId = '') => {
  if (!userId) {
    return getUser().isSystemUser();
  }

  return getUser(userId).isSystemUser();
};

module.exports = isSystemUser;
