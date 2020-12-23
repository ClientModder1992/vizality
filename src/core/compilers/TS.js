const { readFileSync } = require('fs');
const sucrase = require('sucrase');

const Compiler = require('./compiler');

/**
 * JSX compiler
 * @extends {Compiler}
 */
module.exports = class TS extends Compiler {
  _compile () {
    const jsx = readFileSync(this.file, 'utf8');
    return sucrase.transform(jsx, {
      transforms: [ 'jsx', 'imports', 'typescript' ],
      filePath: this.file
    }).code;
  }

  get _metadata () {
    return `sucrase ${sucrase.getVersion()}`;
  }
};
