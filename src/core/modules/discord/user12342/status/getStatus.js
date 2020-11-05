const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const getCurrentUserId = require('../getCurrentUserId');

/**
 * Get's the user's status.
 * If no user ID is specified, tries to use the current user's ID.
 * @param {snowflake} [userId] - User ID
 * @returns {string} User status
 */
const getStatus = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Status:getStatus';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const StatusModule = getModule('getStatus', 'isMobileOnline');
    return StatusModule.getStatus(userId);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getStatus;
