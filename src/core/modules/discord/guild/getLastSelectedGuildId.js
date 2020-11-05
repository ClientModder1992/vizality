const { getModule } = require('@vizality/webpack');

/**
 * Gets the server ID of the last selected server.
 * @returns {?string} Server ID
 */
const getLastSelectedGuildId = () => {
  try {
    const GuildIdModule = getModule('getLastSelectedGuildId');
    return GuildIdModule.getLastSelectedGuildId();
  } catch (err) {
    // Fail silently
  }
};

module.exports = getLastSelectedGuildId;
