/**
 * Utility module.
 * Contains utility functions that may be used by the other modules.
 *
 * @module discord.utility
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
