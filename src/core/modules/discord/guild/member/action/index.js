/**
 * Guild action module.
 * Contains functions/data that perform guild-related actions.
 * @namespace discord.guild.member.action
 * @module discord.guild.member.action
 * @memberof discord.guild.member
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
