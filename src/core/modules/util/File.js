import { promises, existsSync, lstatSync, readFileSync, readdirSync } from 'fs';
import { lookup as getMimeType } from 'mime-types';
import { extname, join, basename } from 'path';

const { readdir, lstat, unlink, rmdir } = promises;
/**
 * @module util.file
 * @namespace util.file
 * @memberof util
 * @version 0.0.1
 */

export const removeDirRecursive = async directory => {
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
};

export const getImageDimensions = async image => {
  return new Promise(resolved => {
    const img = new Image();
    img.onload = () => {
      resolved({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.src = image;
  });
};

export const getObjectURL = async (path, allowedExtensions = [ '.png', '.jpg', '.jpeg', '.webp', '.gif' ]) => {
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
};
