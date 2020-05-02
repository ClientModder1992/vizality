const sucrase = require('sucrase');
const { join } = require('path');
const { readFileSync, existsSync, mkdirSync, writeFile } = require('fs');
const { createHash } = require('crypto');
const { CACHE_FOLDER } = require('powercord/constants');

const checksum = (str) => createHash('sha1').update(str).digest('hex');

module.exports = () => {
  const cacheDir = join(CACHE_FOLDER, 'jsx');

  const ensureFolder = () => {
    if (!existsSync(cacheDir)) {
      mkdirSync(cacheDir, { recursive: true });
    }
  };

  // noinspection JSDeprecatedSymbols
  require.extensions['.jsx'] = (_module, filename) => {
    const source = readFileSync(filename, 'utf8');
    const hash = checksum(`/* sucrase-jsx (${sucrase.getVersion()}) | ${filename} */ ${source}`);
    const cached = join(cacheDir, `${hash}.js`);

    try {
      _module._compile(readFileSync(cached, 'utf8'), filename);
    } catch (_) {
      const res = sucrase.transform(source, {
        transforms: [ 'jsx' ],
        filePath: filename
      }).code;

      _module._compile(res, filename);

      writeFile(cached, res, (err) => {
        if (err) {
          console.error('%c[Powercord:JSX]', 'color: #7289da', 'Failed to write to cache');
          console.error(err);
        }
      });
    }
  };

  // noinspection JSDeprecatedSymbols
  require.extensions['.jsx'].ensureFolder = ensureFolder;
  ensureFolder();
};
