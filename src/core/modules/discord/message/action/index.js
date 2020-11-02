/**
 * Message action module.
 * Contains functions/data that perform message-related actions.
 * @namespace discord.message.action
 * @module discord.message.action
 * @memberof discord.message
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
