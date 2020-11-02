/**
 * Guild settings module.
 * Contains functions/data relating to guild settings.
 * @namespace discord.settings.guild
 * @module discord.settings.guild
 * @memberof discord.settings
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
