import { promises, existsSync, lstatSync, readFileSync, readdirSync } from 'fs';
import { lookup as _getMimeType } from 'mime-types';
import { extname, join, parse } from 'path';
import gifResize from '@gumlet/gif-resize';
import { nativeImage } from 'electron';
import imageSize from 'image-size';
import { promisify } from 'util';

const _getImageSize = promisify(imageSize);

import { isString } from './String';

const { readdir, lstat, unlink, rmdir } = promises;
/**
 * @module util.file
 * @namespace util.file
 * @memberof util
 * @version 0.0.1
 */

export const getMimeType = async input => {
  if (input.startsWith('blob:')) {
    return fetch(input)
      .then(res => res.blob().then(blob => blob.type));
  } else if (_getMimeType(input)) {
    return _getMimeType(input);
  }

  let result = null;
  if (typeof input !== 'string') return result;
  const mimeType = input.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,.*/);
  if (mimeType && mimeType.length) [ , result ] = mimeType;

  return result;
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

/**
 * Gets the dimensions of an image or video. Works for URLs (http/blob/data/protocol).
 */
export const getMediaDimensions = async (url, mimeType) => {
  mimeType = mimeType || await this.getMimeType(url);
  // Check if it's an image
  if (mimeType.split('/')[0] === 'image') {
    // If it's a file, we'll use the image-size package
    if (existsSync(url) && lstatSync(url).isFile()) {
      return new Promise(resolved => {
        _getImageSize(url).then(dimensions => resolved({ width: dimensions.width, height: dimensions.height }));
      });
    }
    return new Promise(resolved => {
      const img = new Image();
      img.onload = () => resolved({ width: img.naturalWidth, height: img.naturalHeight });
      img.src = url;
    });
  // Check if it's a video
  } else if (mimeType.split('/')[0] === 'video') {
    return new Promise(resolve => {
      const video = document.createElement('video');
      video.src = url;
      video.addEventListener('loadedmetadata', () =>
        resolve({
          width: video.videoWidth,
          height: video.videoHeight
        })
      );
    });
  }
};

export const resizeImage = async (input, options) => {
  const { width, height } = options;
  const type = await getMimeType(input);
  let dataURL;

  if (type.split('/')[0] === 'image') {
    if (type === 'image/gif' || type === 'image/webp') {
      const buffer = readFileSync(input);
      await gifResize({ width, height })(buffer)
        .then(async data => dataURL = `data:${type};base64,${data.toString('base64')}`);
    } else {
      const image = nativeImage.createFromPath(input);
      const resizedImage = image.resize({ width, height });
      dataURL = resizedImage.toDataURL();
    }
  }

  return dataURL;
};

export const convertURLToFile = (url, fileName) => {
  return fetch(url)
    .then(res => res.arrayBuffer())
    .then(async buffer => new File([ buffer ], fileName, { type: await this.getMimeType(url) }));
};

export const getObjectURL = async (path, allowedExtensions = [ '.png', '.jpg', '.jpeg', '.webp', '.gif' ]) => {
  if (isString(allowedExtensions) && allowedExtensions !== 'all') {
    allowedExtensions = [ allowedExtensions ];
  }

  const urlObjects = [];

  const isDir = existsSync(path) && lstatSync(path).isDirectory();
  const isFile = existsSync(path) && lstatSync(path).isFile();

  const getURL = async file => {
    const buffer = readFileSync(file);
    const ext = extname(file).slice(1);
    const type = await this.getMimeType(ext);
    const blob = new Blob([ buffer ], { type });
    const url = URL.createObjectURL(blob);
    const { name } = parse(file);
    /**
     * If it's an image, let's include the width and height
     * as properties to make it easier on the developer.
     */
    let width, height;
    if ([ 'png', 'jpg', 'jpeg', 'webp', 'gif' ].includes(ext)) {
      const dimensions = await this.getMediaDimensions(url, type);
      ({ width, height } = dimensions);
    }

    if (width && height) {
      return urlObjects.push({
        name,
        url,
        path: file,
        width,
        height,
        type
      });
    }

    return urlObjects.push({
      name,
      url,
      path: file,
      type
    });
  };

  if (isDir) {
    const files = readdirSync(path)
      .filter(file => lstatSync(join(path, file)).isFile() && (allowedExtensions.indexOf(extname(file)) !== -1 || allowedExtensions === 'all'));

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
