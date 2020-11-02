/**
 * Channel settings module.
 * Contains functions/data relating to channel settings.
 * @namespace discord.settings.channel
 * @module discord.settings.channel
 * @memberof discord.settings
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
