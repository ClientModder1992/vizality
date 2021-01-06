const { readFileSync } = require('fs');
const sucrase = require('sucrase');

const Compiler = require('./Compiler');

/**
 * JS compiler
 * @extends {Compiler}
 */
module.exports = class JS extends Compiler {
  _compile () {
    const js = readFileSync(this.file, 'utf8');
    return sucrase.transform(js, {
      transforms: [ 'jsx', 'imports' ],
      enableLegacyBabel5ModuleInterop: true,
      filePath: this.file
    }).code;
  }

  get _metadata () {
    return `sucrase ${sucrase.getVersion()}`;
  }
};
