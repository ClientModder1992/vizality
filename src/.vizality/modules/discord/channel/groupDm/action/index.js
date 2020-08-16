/**
 * Group DM channel action module.
 * Contains functions/data that perform group DM channel-related actions.
 * @namespace discord.channel.groupDm
 * @module discord.channel.groupDm
 * @memberof discord.channel
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
