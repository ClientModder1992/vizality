const { logger: { error } } = require('@vizality/util');

const getCurrentGuildId = require('../getCurrentGuildId');
const getGuild = require('../getGuild');

/**
 * Gets a role object.
 * If only 1 argument is specified, it will be assumed to be a role ID,
 * and it will attempt to retreive the role data object from the currently selected guild.
 * @param {snowflake} guildId - Guild ID | Role ID (if only 1 argument specified)
 * @param {?snowflake} [roleId] - Role ID
 * @returns {Role|undefined} Role object
 */
const getRole = (guildId, roleId) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:getRole';

  if (arguments.length === 1) {
    roleId = guildId;
    /*
     * Set guildID to null here; it will be replaced with
     * the current guild's ID (if there is one) below
     */
    guildId = null;
  }

  // If no guild ID is provided, use the current guild ID
  guildId = guildId || getCurrentGuildId();

  try {
    const Guild = getGuild(guildId);
    const Role = Guild.roles[roleId];
    return Role;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = getRole;
