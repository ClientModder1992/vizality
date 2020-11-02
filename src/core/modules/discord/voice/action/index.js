/**
 * Voice action module.
 * Contains functions/data that perform voice-related actions.
 * @namespace discord.voice.action
 * @module discord.voice.action
 * @memberof discord.voice
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
