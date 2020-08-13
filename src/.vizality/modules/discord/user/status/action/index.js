/**
 * User status action module.
 * Contains functions/data that perform user status-related actions.
 *
 * @module discord.user.status.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
