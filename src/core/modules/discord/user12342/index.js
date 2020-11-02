/**
 * User module.
 * Contains functions/data relating to users.
 * @namespace discord.user
 * @module discord.user
 * @memberof discord
 */
require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

/*
 * const { sep } = require('path');
 *const pathArray = __dirname.split(sep);
 *
 *console.log(pathArray);
 *console.log(moduleName);
 *console.log(filename);
 * /*
 * Using lastIndexOf 'core' here to make sure
 * we don't run into same directory name problems
 *
 *const moduleIndex = pathArray.lastIndexOf('core') + 1;
 *const mdl = pathArray[moduleIndex];
 *const submoduleIndex = moduleIndex + 1;
 *
 *console.log(mdl);
 *console.log(submoduleIndex);
 *
 *let submodule;
 *const submodulePath = pathArray.slice(submoduleIndex);
 *
 *console.log(submodulePath);
 *
 *for (const item of submodulePath) {
 *  submodule = submodule ? `${submodule}:${item}` : item;
 *
 *  console.log(item);
 *}
 *
 *submodule += moduleName;
 *
 *console.log(submodule);
 *
 *console.log(exports[moduleName]);
 *
 *if (exports[moduleName].setNote) {
 *  exports[moduleName].setNote._module = 'hmm';
 *  exports[moduleName].setNote._submodule = 'butt';
 *  console.log('YAYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYY');
 *}
 *});
 */
