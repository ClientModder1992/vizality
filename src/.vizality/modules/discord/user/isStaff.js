const getUser = require('./getUser');

const isStaff = (userId = '') => {
  if (!userId) {
    return getUser().isStaff();
  }

  return getUser(userId).isStaff();
};

module.exports = isStaff;
