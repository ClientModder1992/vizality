/**
 * Invite action module.
 * Contains functions/data that perform invite-related actions.
 *
 * @module discord.invite.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
