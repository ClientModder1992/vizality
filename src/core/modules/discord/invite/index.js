/**
 * Invite module.
 * Contains functions/data relating to guild invites.
 * @namespace discord.invite
 * @module discord.invite
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
