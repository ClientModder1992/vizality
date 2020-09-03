const { logger: { error } } = require('@utilities');

const getCurrentUserId = require('./getCurrentUserId');
const getUser = require('./getUser');

const Constants = require('../module/constants');

/**
 * Checks if the user is a partner.
 * If no user ID is specified, tries to use the current user's ID.
 * @param {snowflake} [userId] - User ID
 * @returns {boolean} Whether the user is a partner
 */
const isPartner = (userId) => {
  const _module = 'Module';
  const _submodule = 'Discord:User:isPartner';

  // If no user ID is provided, use the current user's ID
  userId = userId || getCurrentUserId();

  try {
    const User = getUser(userId);
    return User.hasFlag(Constants.UserFlags.PARTNER);
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = isPartner;
