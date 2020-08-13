/**
 * Module module.
 * Contains useful webpack module collections,
 * usually in the form of data objects.
 *
 * @module discord.module
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
