/**
 * Snowflake module.
 * Contains functions/data relating to snowflakes.
 * @namespace discord.snowflake
 * @module discord.snowflake
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
