const getValidId = require('../utilities/getValidId');
const getUser = require('./getUser');

/**
 * Checks if the user is a Discord staff member.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {(boolean|undefined)} Whether the user is a Discord staff member
 */
const isStaff = (userId = '') => {
  const _submodule = 'Discord:User:isStaff';

  /*
   * Checks if user ID is a valid string
   * If user ID is an empty string, return the current user's ID
   */
  userId = getValidId(userId, 'user', _submodule);

  try {
    const isStaff = getUser(userId).isStaff();

    return isStaff;
  } catch (err) {
    // Fail silently
  }
};

module.exports = isStaff;
