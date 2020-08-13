/**
 * Group DM channel module.
 * Contains functions/data relating to group DM channels.
 *
 * @module discord.channel.groupDm
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
