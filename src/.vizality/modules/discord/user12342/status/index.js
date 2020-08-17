/**
 * User status module.
 * Contains functions/data relating to user statuses.
 * @namespace discord.user.status
 * @module discord.user.status
 * @memberof discord.user
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
