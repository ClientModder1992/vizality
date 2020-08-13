/**
 * Discord module.
 * Contains all of the function/data that may be useful to allow
 * users and developers to interface more easily with Discord.
 *
 * @module discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
