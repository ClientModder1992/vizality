/**
 * Client action module.
 * Contains functions/data that perform Discord client-related actions.
 * @namespace discord.client.action
 * @module discord.client.action
 * @memberof discord.client
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
