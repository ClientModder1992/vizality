/**
 * Guild channel module.
 * Contains functions/data relating to guild channels.
 *
 * @module discord.channel.guild
 * @alias module:discord.guild.channel
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
