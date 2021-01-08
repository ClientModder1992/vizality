const { readFileSync } = require('fs');
const sucrase = require('sucrase');

const Compiler = require('./Compiler');

/**
 * TSX compiler
 * @extends {Compiler}
 */
module.exports = class TSX extends Compiler {
  _compile () {
    const tsx = readFileSync(this.file, 'utf8');
    return sucrase.transform(tsx, {
      transforms: [ 'jsx', 'imports', 'typescript' ],
      filePath: this.file
    }).code;
  }

  get _metadata () {
    return `sucrase ${sucrase.getVersion()}`;
  }
};
