/**
 * User status action module.
 * Contains functions/data that perform user status-related actions.
 * @namespace discord.user.status.action
 * @module discord.user.status.action
 * @memberof discord.user.status
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
