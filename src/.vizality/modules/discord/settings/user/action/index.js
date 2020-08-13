/**
 * User settings action module.
 * Contains functions/data that perform user settings-related actions.
 *
 * @module discord.settings.user.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
