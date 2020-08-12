const { logger: { error }, object: { isEmpty } } = require('@utilities');

const getGuild = require('../getGuild');

const Permissions = require('../../modules/permissions');

const hasPermission = (guildId, roleId, ...permissions) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guild:Role:hasPermission';

  if (typeof guildId !== 'string') {
    return error(_module, _submodule, null, 'Guild ID must be a valid string.');
  }

  if (typeof roleId !== 'string') {
    return error(_module, _submodule, null, 'Role ID must be a valid string.');
  }

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
