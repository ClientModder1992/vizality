const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const getCurrentUserId = require('../getCurrentUserId');

/**
 * Checks if the user is on mobile.
 * If no user ID is specified, tries to use the current user's ID.
 * @param {snowflake} [userId] - User ID
 * @returns {boolean} Whether the user is on mobile
 */
const isMobile = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Status:isMobile';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const StatusModule = getModule('getStatus', 'isMobileOnline');
    return StatusModule.isMobileOnline(userId);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isMobile;
