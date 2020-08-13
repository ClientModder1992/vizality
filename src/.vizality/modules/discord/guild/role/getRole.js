const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');
const getGuild = require('../getGuild');

/**
 * Gets the specified role's data object.
 * If only 1 argument is specified, it will be assumed to be the role ID,
 * and it will attempt to retreive the role object from the currently selected guild.
 *
 * @param {string} guildId - Guild ID | Role ID (if role ID argument not specified)
 * @param {?string} [roleId] - Role ID
 * @returns {(object|undefined)} Role object
 */
const getRole = (guildId, roleId) => {
  const _submodule = 'Discord:Guild:Role:getRole';

  if (arguments.length === 1) {
    roleId = guildId;
    /*
     * Set guildID to empty an string here; it will be replaced with
     * the current guild's ID (if there is one) through getValidId
     */
    guildId = '';
  }

  // Check if the role ID is a valid string
  if (!isValidId(roleId, 'role', _submodule)) return;

  /*
   * If guild ID is an empty string, get the current guild's ID,
   * else return the guild ID argument value
   */
  guildId = getValidId(guildId, 'guild', _submodule);

  // Check if the guild ID is a valid string
  if (!isValidId(guildId, 'guild', _submodule)) return;

  try {
    const Roles = getGuild(guildId).roles;
    const Role = Roles[roleId];
    return Role;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getRole;
