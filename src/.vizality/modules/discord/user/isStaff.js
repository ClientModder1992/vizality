const getValidId = require('../utilities/getValidId');
const isValidId = require('../utilities/isValidId');
const getUser = require('./getUser');

/**
 * Checks if the user is a Discord staff member.
 * If no user ID is specified, tries to use the current user's ID.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user is a Discord staff member
 */
const isStaff = (userId = '') => {
  const _submodule = 'Discord:User:isStaff';

  /*
   * If user ID is an empty string, return the current user's ID,
   * else return the userId argument value
   */
  userId = getValidId(userId, 'user', _submodule);

  // Check if the ID is now a valid string
  if (!isValidId(userId, 'user', _submodule)) return;

  try {
    const isStaff = getUser(userId).isStaff();
    return Boolean(isStaff);
  } catch (err) {
    // Fail silently
  }
};

module.exports = isStaff;
