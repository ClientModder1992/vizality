const { promises: { readFile }, existsSync, statSync } = require('fs');
const { info: sassInfo } = require('sass');
const { join, dirname } = require('path');

const Compiler = require('./Compiler');

/**
 * SCSS compiler.
 * @class
 * @extends Compiler
 */
module.exports = class SCSS extends Compiler {
  async listFiles () {
    return [
      this.file,
      ...(await this._resolveDeps(this.file))
    ];
  }

  _compile () {
    return vizality.native.__compileSass(this.file);
  }

  /**
   * Resolve dependencies imported in SCSS files.
   * @param {string} file File to crawl
   * @returns {Promise<string[]>}
   */
  async _resolveDeps (file, resolvedFiles = []) {
    const scss = await readFile(file, 'utf8');
    const basePath = dirname(file);
    /*
     * @import: deprecated; let's treat it as @use. Only dumb edge cases will break anyway
     * @use: https://sass-lang.com/documentation/at-rules/use
     * @forward: https://sass-lang.com/documentation/at-rules/forward
     */
    for (const match of scss.matchAll(/@(?:import|use|forward) ['"]([^'"]+)/ig)) {
      const filePath = this._resolveFile(join(basePath, match[1]).replace(/\\/g, '/'));
      if (filePath) {
        if (!resolvedFiles.includes(filePath)) {
          resolvedFiles.push(filePath);
          await this._resolveDeps(filePath, resolvedFiles);
        }
      }
    }

    return resolvedFiles;
  }

  /** @private */
  _resolveFile (partialFile) {
    if (existsSync(partialFile) && statSync(partialFile).isDirectory()) {
      // https://sass-lang.com/documentation/at-rules/use#index-files
      partialFile = join(partialFile, '_index.scss');
      if (existsSync(partialFile)) {
        return partialFile;
      }
      return null;
    }

    const extensions = [ 'scss', 'css' ];
    if (!extensions.some(ext => partialFile.endsWith(`.${ext}`))) {
      for (const ext of extensions) {
        const resolved = this._resolveFile0(`${partialFile}.${ext}`);
        if (resolved) {
          return resolved;
        }
      }
    }
    return this._resolveFile0(partialFile);
  }

  /** @private */
  _resolveFile0 (partialFile) {
    if (!existsSync(partialFile)) {
      // https://sass-lang.com/documentation/at-rules/use#partials
      const f = partialFile.split('/');
      f[f.length - 1] = `_${f[f.length - 1]}`;
      partialFile = f.join('/');
      if (!existsSync(partialFile)) {
        return null;
      }
    }

    if (statSync(partialFile).isDirectory()) {
      return null;
    }
    return partialFile;
  }

  get _metadata () {
    return `${sassInfo}; Vizality import resolver v1`;
  }
};
