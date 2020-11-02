/**
 * Route action module.
 * Contains functions/data that perform generic route-related actions.
 * @namespace discord.route.action
 * @module discord.route.action
 * @memberof discord.route
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
