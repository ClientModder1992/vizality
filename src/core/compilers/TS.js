const { readFileSync } = require('fs');
const sucrase = require('sucrase');

const Compiler = require('./Compiler');

/**
 * TS compiler
 * @extends {Compiler}
 */
module.exports = class TS extends Compiler {
  _compile () {
    const ts = readFileSync(this.file, 'utf8');
    return sucrase.transform(ts, {
      transforms: [ 'jsx', 'imports', 'typescript' ],
      filePath: this.file
    }).code;
  }

  get _metadata () {
    return `sucrase ${sucrase.getVersion()}`;
  }
};
