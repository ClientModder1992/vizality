/**
 * DM channel module.
 * Contains functions/data relating to DM channels.
 * @namespace discord.channel.dm
 * @module discord.channel.dm
 * @memberof discord.channel
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
