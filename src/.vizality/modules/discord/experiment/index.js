/**
 * Experiment module.
 * Contains functions/data relating to Discord's Experiments.
 * @namespace discord.experiment
 * @module discord.experiment
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
