const { promises: { writeFile, mkdir }, existsSync } = require('fs');
const { join } = require('path');

const Constants = require('@constants');
const Util = require('@util');

const { components, layout, views, plugins, vizality } = require('.');

const _module = 'Module';
const _submodule = 'Classes';

module.exports = class Classes {
  static get components () { return components; }
  static get layout () { return layout; }
  static get views () { return views; }
  static get plugins () { return plugins; }
  static get vizality () { return vizality; }

  static findClass (value, exact = false) {
    return Util.Object.findEntriesByValue(this, value, exact);
  }

  static async _checkForUndefined (obj = this, currentPath) {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        this._checkForUndefined(obj[key], newPath);
      } else if (typeof obj[key] === 'undefined') {
        Util.Logger.warn(_module, `${_submodule}:_checkForUndefined`, null, `Value not found: ${currentPath}.${key}`);
      }
    }
  }

  static async _generateSassClasses (obj = this, currentPath) {
    const SassClassFolder = join(Constants.Directories.LIBRARIES, 'sass', 'classes');

    if (!existsSync(SassClassFolder)) {
      await mkdir(SassClassFolder);
    }

    let generatedSass = '';

    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        const newPath = currentPath ? `${currentPath}.${key}` : key;
        this._generateSassClasses(obj[key], newPath);
      } else if (typeof obj[key] === 'string') {
        generatedSass += `$${key}: '.${obj[key].split(' ')[0]}';\n`;
      } else if (typeof obj[key] === 'undefined') {
        Util.Logger.warn(_module, `${_submodule}:_generateSassClasses`, null, `No value found for '${currentPath}.${key}'`);
      }
    }

    const moduleFolder = join(SassClassFolder, currentPath.split('.').join('/'));
    await mkdir(moduleFolder, { recursive: true });
    generatedSass = generatedSass.trim().split('\n').sort().join('\n').replace(/,/g, '');

    if (generatedSass) {
      await writeFile(join(moduleFolder, '_index.scss'), generatedSass, 'utf8');
    }
  }
};

module.exports._checkForUndefined();

const SassClassFolder = join(Constants.Directories.LIBRARIES, 'sass', 'classes');

if (!existsSync(SassClassFolder)) {
  module.exports._generateSassClasses();
} else {
  Util.Logger.log(_module, _submodule, null, `Directory 'src\\.vizality\\libraries\\sass\\classes' already exists. Skipping file generation...`);
}
