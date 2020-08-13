const { logger: { error }, object: { isEmpty } } = require('@utilities');

const isValidId = require('../../utility/isValidId');
const getGuild = require('../getGuild');

const Permissions = require('../../module/permissions');

// @todo Try to clean this file up.

/**
 * Checks if a role of a server has specified permission(s).
 *
 * @param {string} guildId - Server ID
 * @param {string} roleId - Role ID
 * @param {...string} permissions - Permission type
 * @returns {boolean} Does the role have the specified permission(s)?
 */
const hasPermission = (guildId, roleId, ...permissions) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:hasPermission';

  // Check if the guild ID is a valid string
  if (!isValidId(guildId, 'guild', _submodule)) return;

  // Check if the role ID is a valid string
  if (!isValidId(roleId, 'role', _submodule)) return;

  if (isEmpty(permissions)) {
    return error(_module, _submodule, null, `No permission type specified. Here's a list of valid permission types:\n`, Object.keys(Permissions));
  }

  const Guild = getGuild(guildId);
  const Roles = Guild.roles[roleId];

  let hasPerms;

  for (const permission of permissions) {
    if (!Object.keys(Permissions).includes(permission)) {
      return error(_module, _submodule, null, `Permission type '${permission}' not found. Here's a list of valid permission types:\n`, Object.keys(Permissions));
    }

    if ((Roles.permissions & Permissions[permission]) === Permissions[permission].to32BitNumber()) {
      hasPerms = true;
    } else {
      hasPerms = false;
    }

    if (hasPerms === false) {
      break;
    }
  }

  return hasPerms;
};

module.exports = hasPermission;
