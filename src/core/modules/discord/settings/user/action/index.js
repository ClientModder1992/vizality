/**
 * User settings action module.
 * Contains functions/data that perform user settings-related actions.
 * @namespace discord.settings.user.action
 * @module discord.settings.user.action
 * @memberof discord.settings.user
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
