const { logger: { error } } = require('@utilities');
const { getModule } = require('@webpack');

const getCurrentGuildId = require('./getCurrentGuildId');

/**
 * Gets a guild's data object.
 * If no guild ID is specified, tries to get the currently selected guild's object.
 * @param {snowflake} [guildId] Guild ID
 * @returns {Guild|undefined} Guild object
 */
const getGuild = (guildId) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:getGuild';

  // If no guild ID is provided, use the current guild ID
  guildId = guildId || getCurrentGuildId();

  try {
    const GuildModule = getModule('getGuild', 'getGuilds');
    const Guild = GuildModule.getGuild(guildId);

    // Check if guild ID is a string
    if (typeof guildId !== 'string') {
      throw new TypeError(`"guildId" argument must be a string (received ${typeof guildId})`);
    }

    // If no guild is returned
    if (!Guild) {
      throw new Error(`Guild with ID '${guildId}' not found. Either the ID is invalid, the guild is not cached, or it is facing an outage.`);
    }

    return Guild;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getGuild;
