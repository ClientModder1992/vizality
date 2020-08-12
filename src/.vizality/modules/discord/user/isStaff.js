const getUser = require('./getUser');

/**
 * Checks if the user is a Discord staff member. If no user ID is specified,
 * tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} true/false
 */
const isStaff = (userId = '') => {
  if (!userId) {
    return getUser().isStaff();
  }

  return getUser(userId).isStaff();
};

module.exports = isStaff;
