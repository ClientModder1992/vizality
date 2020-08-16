/**
 * Guild channel module.
 * Contains functions/data relating to guild channels.
 * @namespace discord.guild.channel
 * @module discord.guild.channel
 * @memberof discord.guild
 * @see {module:discord.channel.guild}
 */
const { join } = require('path');
const mainModulePath = join(__dirname, '..', '..', 'channel', 'guild');

require('fs')
  .readdirSync(mainModulePath)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${mainModulePath}/${filename}`);
  });
