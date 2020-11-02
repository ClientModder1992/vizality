/**
 * User activity action module.
 * Contains functions/data that perform generic user activity-related actions.
 * @namespace discord.user.activity.action
 * @module discord.user.activity.action
 * @memberof discord.user.activity
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
