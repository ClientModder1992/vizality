/**
 * Guild settings action module.
 * Contains functions/data that perform guild settings-related actions.
 * @namespace discord.settings.guild.action
 * @module discord.settings.guild.action
 * @memberof discord.settings.guild
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
