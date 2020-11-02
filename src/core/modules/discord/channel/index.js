/**
 * Channel submodule.
 * Contains functions/data that are usable for all channel types.
 * @namespace discord.channel
 * @module discord.channel
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
