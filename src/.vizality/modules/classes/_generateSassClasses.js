const { logger: { warn } } = require('@utilities');
const { LIBRARIES_FOLDER } = require('@constants');

const { join } = require('path');
const { promises: { writeFile, mkdir }, existsSync } = require('fs');

const classes = require('../classes');

const _generateSassClasses = async (obj = classes, currentPath = '') => {
  const module = 'Module';
  const submodule = 'Classes:_generateSassClasses';

  const SassClassFolder = join(LIBRARIES_FOLDER, 'sass', 'classes');

  if (!existsSync(SassClassFolder)) {
    await mkdir(SassClassFolder);
  }

  let generatedSass = '';

  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const newPath = currentPath ? `${currentPath}.${key}` : key;
      _generateSassClasses(obj[key], newPath);
    } else if (typeof obj[key] === 'string') {
      generatedSass += `$${key}: '.${obj[key].split(' ')[0]}';\n`;
    } else if (typeof obj[key] === 'undefined') {
      warn(module, submodule, null, `No value found for '${currentPath}.${key}'`);
    }
  }

  const moduleFolder = join(SassClassFolder, currentPath.split('.').join('/'));

  await mkdir(moduleFolder, { recursive: true });

  generatedSass = generatedSass.trim().split('\n').sort().join('\n').replace(/,/g, '');

  if (generatedSass) {
    await writeFile(join(moduleFolder, '_index.scss'), generatedSass, 'utf8');
  }
};

module.exports = _generateSassClasses;
