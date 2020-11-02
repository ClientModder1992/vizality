/**
 * Guild module.
 * Contains functions/data relating to guilds.
 * @namespace discord.guild
 * @module discord.guild
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
