/**
 * Guild folder action module.
 * Contains functions/data that perform guild folder-related actions.
 * @namespace discord.guild.folder.action
 * @module discord.guild.folder.action
 * @memberof discord.guild.folder
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
