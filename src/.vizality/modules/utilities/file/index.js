/* eslint-disable no-unused-vars */

const { promises: { readdir, lstat, unlink, rmdir } } = require('fs');
const { existsSync } = require('fs');

/**
 * @module util.file
 * @namespace util.file
 * @memberof util
 * @version 0.0.1
 */
const file = module.exports = {
  async removeDirRecursive (directory) {
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
  },

  async getImageDimensions (image) {
    return new Promise(resolved => {
      const img = new Image();
      img.onload = () => {
        resolved({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = image;
    });
  }
};
