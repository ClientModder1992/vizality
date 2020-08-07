const { logger: { error, warn } } = require('@utilities');
const { getModule } = require('@webpack');

const Permissions = require('../../permissions');

const hasPermissions = (guildId, roleId, ...permissions) => {
  const _module = 'Module';
  const _submodule = 'Discord:Guilds:Roles:hasPermissions';
  
  if (!guildId || !parseInt(guildId)) {
    return error(_module, _submodule, null, 'The first argument must be a valid server ID.');
  }

  if (!roleId || !parseInt(roleId)) {
    return error(_module, _submodule, null, 'The second argument must be a valid role ID.');
  }

  const Guild = getModule('getGuild').getGuild(guildId);

  if (!Guild) {
    return error(_module, _submodule, null, `Server with id '${guildId}' not found.`);
  }

  const Roles = Guild.roles[roleId];

  if (!Roles) {
    return error(_module, _submodule, null, `Role with id '${roleId}' not found for the specified server.`);
  }

  let hasPerms;
  for (const permission of permissions) {
    if (!Object.keys(Permissions).includes(permission)) {
      return error(_module, _submodule, null, `Permission '${permission}' not found. Here is a list of valid permissions: `, Object.keys(Permissions));
    }

    if ((Roles.permissions & Permissions[permission]) == Permissions[permission]) {
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

module.exports = hasPermissions;
