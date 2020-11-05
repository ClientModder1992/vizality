const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

/**
 * Gets the currently selected guild's ID.
 * @returns {?snowflake} Guild ID
 */
const getCurrentGuildId = () => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:getCurrentGuildId';

  try {
    const CurrentGuildModule = getModule('getLastSelectedGuildId');
    return CurrentGuildModule.getGuildId();
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getCurrentGuildId;
