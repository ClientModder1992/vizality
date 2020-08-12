const { logger: { error } } = require('@utilities');

const hasActivityOfType = require('./hasActivityOfType');
const getCurrentUserId = require('../getCurrentUserId');

const Constants = require('../../modules/constants');

/**
 * Checks if the user has a custom status present. If no user ID is specified, tries
 * to check for the current user.
 *
 * @param {string} [userId] - User ID
 * @returns {boolean} Whether the user has a custom status
 */
const hasCustomStatus = (userId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:User:Activity:hasCustomStatus';

  // Check if the user ID is a valid string
  if (typeof userId !== 'string') {
    return error(_module, _submodule, null, `User ID must be a valid string.`);
  }

  // If no user ID specified, use the current user's
  if (!userId) {
    userId = getCurrentUserId();
  }

  const { ActivityTypes } = Constants;

  const hasCustomStatus = hasActivityOfType(userId, ActivityTypes.CUSTOM_STATUS);

  return hasCustomStatus;
};

module.exports = hasCustomStatus;
