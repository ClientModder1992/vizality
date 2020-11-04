/**
 * Guild role action module.
 * Contains functions/data that perform guild role-related actions.
 * @namespace discord.guild.role.action
 * @module discord.guild.role.action
 * @memberof discord.guild.role
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });