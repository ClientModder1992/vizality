/**
 * Guild role module.
 * Contains functions/data relating to guild roles.
 * @namespace discord.guild.role
 * @module discord.guild.role
 * @memberof discord.guild
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
