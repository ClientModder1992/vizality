const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');
const getGuild = require('../getGuild');

/**
 * Gets all of the specified server's role data objects. If no server ID is specified,
 * tries to get the currently selected server's role data objects.
 *
 * @param {string} [guildId] - Server ID
 * @returns {object|undefined} All of the role data objects for the server or undefined
 */
const getRoles = (guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:getRoles';

  // Check if the guild ID is a valid string
  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, 'Guild ID must be a valid string.');
  }

  // If no server ID specified, use the currently selected server's ID
  if (!guildId) {
    guildId = getCurrentGuildId();

    // Check if there is a currently selected server
    if (!guildId) {
      return error(_module, _submodule, null, 'You did not specify a server ID and you do not currently have a server selected.');
    }
  }

  const Roles = getGuild(guildId).roles;

  return Roles;
};

module.exports = getRoles;
