const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentGuildId = require('./getCurrentGuildId');

/**
 * Gets the server's data object. If no server ID is specified,
 * tries to get the currently selected server's data object.
 *
 * @param {string} [guildId] - Server ID
 * @returns {object|undefined} Server data object or undefined
 */
const getGuild = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:getGuild';

  // Check if the server ID is a valid string
  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, `Server ID must be a valid string.`);
  }

  // If no server ID specified, use the currently selected server's ID
  if (!guildId) {
    guildId = getCurrentGuildId();

    // Check if there is a currently selected server
    if (!guildId) {
      return error(_module, _submodule, null, 'You did not specify a server ID and you do not currently have a server selected.');
    }
  }

  const Guild = getModule('getGuild').getGuild(guildId);

  // Check if the guild object exists
  if (!Guild) {
    return error(_module, _submodule, null, `Server with ID '${guildId}' not found. The ID is either invalid or the server is not yet cached.`);
  }

  return Guild;
};

module.exports = getGuild;
