/**
 * Invite action module.
 * Contains functions/data that perform invite-related actions.
 * @namespace discord.invite.action
 * @module discord.invite.action
 * @memberof discord.invite
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
