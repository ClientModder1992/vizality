/**
 * Channel settings action module.
 * Contains functions/data that perform channel settings-related actions.
 * @namespace discord.settings.channel.action
 * @module discord.settings.channel.action
 * @memberof discord.settings.channel
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
