const { promises: { readdir, lstat, unlink, rmdir }, existsSync, lstatSync, readFileSync, readdirSync } = require('fs');
const { lookup: getMimeType } = require('mime-types');
const { extname, join, basename } = require('path');

/**
 * @module util.file
 * @namespace util.file
 * @memberof util
 * @version 0.0.1
 */
const File = module.exports = {
  async removeDirRecursive (directory) {
    if (existsSync(directory)) {
      const files = await readdir(directory);
      for (const file of files) {
        const currentPath = `${directory}/${file}`;
        const stat = await lstat(currentPath);

        if (stat.isDirectory()) {
          await File.removeDirRecursive(currentPath);
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
  },

  async getObjectURL (path, allowedExtensions = [ '.png', '.jpg', '.jpeg', '.webp', '.gif' ]) {
    if (typeof allowedExtensions === 'string' || allowedExtensions instanceof String) {
      allowedExtensions = allowedExtensions.split();
    }

    const URLs = [];
    const isDir = existsSync(path) && lstatSync(path).isDirectory();
    const isFile = existsSync(path) && lstatSync(path).isFile();

    const getURL = (file) => {
      const buffer = readFileSync(file);
      const ext = extname(file).slice(1);
      const blob = new Blob([ buffer ], { type: getMimeType(ext) });
      return URLs.push({
        name: basename(file, extname(file)),
        url: URL.createObjectURL(blob),
        path: file
      });
    };

    if (isDir) {
      readdirSync(path)
        .filter(file => lstatSync(join(path, file)).isFile() && allowedExtensions.indexOf(extname(file)) !== -1)
        .map(file => getURL(join(path, file)));
    } else {
      if (isFile) {
        getURL(path);
      }
    }

    return URLs;
  }
};
