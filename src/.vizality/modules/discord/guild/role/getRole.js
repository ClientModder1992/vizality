const getValidId = require('../../utility/getValidId');
const isValidId = require('../../utility/isValidId');
const getGuild = require('../getGuild');

/**
 * Gets the specified role's data object. If no server ID is specified,
 * tries to get the currently selected server's role's data object.
 *
 * @param {string} roleId - Role ID
 * @param {string} [guildId] - Server ID
 * @returns {object|undefined} Role data object
 */
const getRole = (roleId, guildId = '') => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:getRole';

  // Check if the role ID is a valid string
  if (typeof roleId !== 'string') {
    return error(_module, _submodule, null, 'Role ID must be a valid string.');
  }

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
  const Role = Roles[roleId];

  return Role;
};

module.exports = getRole;
