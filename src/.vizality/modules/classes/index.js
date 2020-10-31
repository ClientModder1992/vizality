require('fs')
  .readdirSync(__dirname)
  .filter(file => file !== 'index.js')
  .forEach(filename => {
    const moduleName = filename.split('.')[0];
    exports[moduleName] = require(`${__dirname}/${filename}`);
  });

const { Directories } = require('@constants');
const { logger: { log }, object: { removeEmptyProperties } } = require('@util');

const { join } = require('path');
const { existsSync } = require('fs');

const _checkForUndefined = require('./_checkForUndefined');
const _generateSassClasses = require('./_generateSassClasses');

const components = require('./components');
const layout = require('./layout');
const views = require('./views');
const plugins = require('./plugins');
const vizality = require('./vizality');

const classes = {
  components,
  layout,
  views,
  plugins,
  vizality
};

exports = classes;

_checkForUndefined();
removeEmptyProperties(classes);

const _module = 'Module';
const _submodule = 'Classes';
const SassClassFolder = join(Directories.LIB, 'sass', 'classes');

if (!existsSync(SassClassFolder)) {
  _generateSassClasses();
} else {
  log(_module, _submodule, null, `Directory 'src\\.vizality\\libraries\\sass\\classes' already exists. Skipping file generation...`);
}
