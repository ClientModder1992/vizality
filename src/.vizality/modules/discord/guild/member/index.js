/**
 * Guild member module.
 * Contains functions/data relating to guild members.
 * @namespace discord.guild.member
 * @module discord.guild.member
 * @memberof discord.guild
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
