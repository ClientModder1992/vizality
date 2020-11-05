const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');


/**
 * Gets the current user's ID.
 * @returns {snowflake|undefined} User ID
 */
const getCurrentUserId = () => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getCurrentUserId';

  try {
    const CurrentUserIdModule = getModule('getId');
    return CurrentUserIdModule.getId();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getCurrentUserId;
