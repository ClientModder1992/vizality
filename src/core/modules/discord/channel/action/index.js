/**
 * Channel action module.
 * Contains functions/data that perform channel-related actions.
 * @namespace discord.channel.action
 * @module discord.channel.action
 * @memberof discord.channel
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
