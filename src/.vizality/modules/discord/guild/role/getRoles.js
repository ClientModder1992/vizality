const { logger: { error } } = require('@utilities');

const getCurrentGuildId = require('../getCurrentGuildId');
const getGuild = require('../getGuild');

/**
 * Gets all of the role objects for a guild.
 * If no guild ID is specified, tries to get the currently selected guild's role objects.
 * @param {snowflake} [guildId] - Guild ID
 * @returns {Role|undefined} All of the role objects for a guild
 */
const getRoles = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:getRoles';

  // If no guild ID is provided, use the current guild ID
  guildId = guildId || getCurrentGuildId();

  try {
    const Guild = getGuild(guildId);
    const Roles = Guild.roles;
    return Roles;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getRoles;
