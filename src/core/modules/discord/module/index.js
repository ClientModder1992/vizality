/**
 * Module module.
 * Contains useful webpack module collections,
 * usually in the form of data objects.
 * @namespace discord.module
 * @module discord.module
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
