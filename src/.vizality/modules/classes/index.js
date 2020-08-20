const { DIR: { LIBRARIES_DIR } } = require('@constants');
const { logger: { log } } = require('@utilities');

const { join } = require('path');
const { existsSync } = require('fs');

const _checkForUndefined = require('./_checkForUndefined');
const _generateSassClasses = require('./_generateSassClasses');
const findClass = require('./findClass');

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

module.exports = { classes, findClass };

_checkForUndefined();

const _module = 'Module';
const _submodule = 'Classes';
const SassClassFolder = join(LIBRARIES_DIR, 'sass', 'classes');

if (!existsSync(SassClassFolder)) {
  _generateSassClasses();
} else {
  log(_module, _submodule, null, `Directory 'src\\.vizality\\libraries\\sass\\classes' already exists. Skipping file generation...`);
}
