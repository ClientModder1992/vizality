/**
 * User action module.
 * Contains functions/data that perform generic user-related actions.
 * @namespace discord.user.action
 * @module discord.user.action
 * @memberof discord.user
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
