/**
 * Guild folder module.
 * Contains functions/data relating to guild folders.
 * @namespace discord.guild.folder
 * @module discord.guild.folder
 * @memberof discord.guild
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
