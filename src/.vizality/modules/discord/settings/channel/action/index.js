/**
 * Channel settings action module.
 * Contains functions/data that perform channel settings-related actions.
 *
 * @module discord.settings.channel.action
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
