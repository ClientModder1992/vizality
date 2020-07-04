/**
 * This directory is only here to allow Powercord
 * plugins to continue to work that use them. Rather than
 * insert SVGs as React elements, which makes sense from a
 * native perspective, from a modder's perspective I have
 * gone with a way where the icons can essentially be easily
 * shareable and modifiable between theme devs and plugins devs
 * by inserting the icons as divs and styling them with CSS
 * custom properties with encoded SVG values and masking.
 *
 * Prefer to use const { Icon } = require('vizality/components');
 */

require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });
