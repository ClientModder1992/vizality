const { logger: { error }, object: { isEmpty } } = require('@vizality/util');

const getGuild = require('../getGuild');

const Permissions = require('../../module/permissions');

/**
 * Checks if a role of a guild has the provided permissions.
 * @param {snowflake} guildId Guild ID
 * @param {snowflake} roleId Role ID
 * @param {...string} permissions Permission type
 * @returns {boolean} Whether the role has the provided permissions
 */
const hasPermission = (guildId, roleId, ...permissions) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:hasPermission';

  try {
    if (isEmpty(permissions)) {
      // Valid permission types: Object.keys(vizality.modules.dicord.module.permissions)
      throw new Error(`You must provide at least one permission type.`);
    }

    const Guild = getGuild(guildId);
    const Roles = Guild.roles[roleId];

    let hasPerms;

    for (const permission of permissions) {
      if (!Object.keys(Permissions).includes(permission)) {
        throw new Error(`${permission} is not a valid permission type.`);
      }

      hasPerms = ((Roles.permissions & Permissions[permission]) === Permissions[permission].to32BitNumber());

      // Break out if hasPerms becomes false
      if (!hasPerms) break;
    }

    return hasPerms;
  } catch (err) {
    return error(_module, _submodule, null, err);
  }
};

module.exports = hasPermission;
