const { promises: { readdir, lstat, unlink, rmdir } } = require('fs');
const { existsSync } = require('fs');

/**
 * @module Util.File
 * @namespace Util.File
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class File {
  static async removeDirRecursive (directory) {
    if (existsSync(directory)) {
      const files = await readdir(directory);
      for (const file of files) {
        const currentPath = `${directory}/${file}`;
        const stat = await lstat(currentPath);

        if (stat.isDirectory()) {
          await this.removeDirRecursive(currentPath);
        } else {
          await unlink(currentPath);
        }
      }
      await rmdir(directory);
    }
  }
};
