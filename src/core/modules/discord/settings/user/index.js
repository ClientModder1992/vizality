/**
 * User settings module.
 * Contains functions/data relating to user settings.
 * @namespace discord.settings.user
 * @module discord.settings.user
 * @memberof discord.settings
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
