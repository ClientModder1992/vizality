const { promises: { readFile }, existsSync, statSync } = require('fs');
const { join, dirname } = require('path');
const Compiler = require('./compiler');
const { info: sassInfo } = require('sass');

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
    return VizalityNative.__compileSass(this.file);
  }

  /**
   * Resolve dependencies imported in SCSS files.
   * 
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
      // console.log('resolve');
      const filePath = this._resolveFile(join(basePath, match[1]).replace(/\\/g, '/'));
      // if (!match[1].indexOf('@library')) {
      //   match[1] = match[1].replace('@library', 'sass');
      //   filePath = this._resolveFile(join(LIBRARIES_FOLDER, match[1]).replace(/\\/g, '/'));
      // } else {
      //   filePath = this._resolveFile(join(basePath, match[1]).replace(/\\/g, '/'));
      // }
      // console.log('match', match[1]);
      // console.log('join', join(basePath, match[1]).replace(/\\/g, '/'));
      // console.log('filePath', filePath);
      // Not all imports have to be resolved; https://sass-lang.com/documentation/at-rules/import#plain-css-imports
      if (filePath) {
        // console.log('yes');
        if (!resolvedFiles.includes(filePath)) {
          // console.log('2nd', filePath);
          resolvedFiles.push(filePath);
          await this._resolveDeps(filePath, resolvedFiles);
          // console.log('resolvedFiles', resolvedFiles);
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
