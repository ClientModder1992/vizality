/**
 * Activity module.
 * Contains functions/data related to activities.
 * @namespace discord.activity
 * @module discord.activity
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
