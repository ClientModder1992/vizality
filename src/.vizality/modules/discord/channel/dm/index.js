/**
 * DM channel module.
 * Contains functions/data relating to DM channels.
 *
 * @module discord.channel.dm
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
