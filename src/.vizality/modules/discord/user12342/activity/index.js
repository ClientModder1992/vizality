/**
 * User activity module.
 * Contains functions/data relating to user activities.
 * @namespace discord.user.activity
 * @module discord.user.activity
 * @memberof discord.user
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
