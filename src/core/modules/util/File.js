import { promises, existsSync, lstatSync, readFileSync, readdirSync } from 'fs';
import { extname, join, parse } from 'path';
import { lookup as _getMimeType } from 'mime-types';

import { isString } from './String';

const { readdir, lstat, unlink, rmdir } = promises;
/**
 * @module util.file
 * @namespace util.file
 * @memberof util
 * @version 0.0.1
 */

export const getMimeType = file => {
  return _getMimeType(file);
};

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

export const convertURLToFile = (url, fileName) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(buffer => new File([ buffer ], fileName, { type: this.getMimeType(url) }));
};

export const getObjectURL = async (path, allowedExtensions = [ '.png', '.jpg', '.jpeg', '.webp', '.gif' ]) => {
  if (isString(allowedExtensions)) {
    allowedExtensions = [ allowedExtensions ];
  }

  const urlObjects = [];

  const isDir = existsSync(path) && lstatSync(path).isDirectory();
  const isFile = existsSync(path) && lstatSync(path).isFile();

  const getURL = async file => {
    const buffer = readFileSync(file);
    const ext = extname(file).slice(1);
    const blob = new Blob([ buffer ], { type: this.getMimeType(ext) });
    const url = URL.createObjectURL(blob);
    const { name } = parse(file);
    /**
     * If it's an image, let's include the width and height
     * as properties to make it easier on the developer.
     */
    let width, height;
    if ([ 'png', 'jpg', 'jpeg', 'webp', 'gif' ].includes(ext)) {
      const dimensions = await this.getImageDimensions(url);
      ({ width, height } = dimensions);
    }

    console.log('???');

    if (width && height) {
      return urlObjects.push({
        name,
        url,
        path: file,
        width,
        height
      });
    }

    return urlObjects.push({
      name,
      url,
      path: file
    });
  };

  if (isDir) {
    const files = readdirSync(path)
      .filter(file => lstatSync(join(path, file)).isFile() && allowedExtensions.indexOf(extname(file)) !== -1);

    for (const file of files) {
      await getURL(join(path, file));
    }
  } else {
    if (isFile) {
      await getURL(path);
    }
  }

  return urlObjects;
};
