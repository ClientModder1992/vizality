const { logger: { error } } = require('@util');
const { getModule } = require('@webpack');

/**
 * Gets all of the currently cached user IDs.
 * @returns {Array<snowflake>|undefined} All cached user IDs
 */
const getUserIds = () => {
  const _module = 'Module';
  const _submodule = 'Discord:User:getUserIds';

  try {
    const StatusModule = getModule('getStatus', 'getUserIds');
    return StatusModule.getUserIds();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getUserIds;
