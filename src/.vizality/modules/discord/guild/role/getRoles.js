const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');
const getGuild = require('../getGuild');

/**
 * Gets all of the specified server's role data objects.
 * If no server ID is specified, tries to get the currently selected server's role data objects.
 *
 * @param {string} [guildId] - Server ID
 * @returns {(object|undefined)} All of the role data objects for the server or undefined
 */
const getRoles = (guildId = '') => {
  const _submodule = 'Discord:Guild:Role:getRoles';

  /*
   * If guild ID is an empty string, return the current guild's ID,
   * else return the guild ID argument value
   */
  guildId = getValidId(guildId, 'guild', _submodule);

  // Check if the guild ID is a valid string
  if (!isValidId(guildId, 'guild', _submodule)) return;

  try {
    const Roles = getGuild(guildId).roles;
    return Roles;
  } catch (err) {
    // Fail silently
  }
};

module.exports = getRoles;
