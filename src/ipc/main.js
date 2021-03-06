const { existsSync, promises: { readFile } } = require('fs');
const { relative, join, dirname, resolve } = require('path');
const { ipcMain, BrowserWindow } = require('electron');
const sass = require('sass');

const VIZALITY_REGEX = new RegExp('@vizality([^\'"]{1,})?', 'ig');
const LIB_DIR = join(__dirname, '..', 'core', 'lib', 'sass');

if (!ipcMain) {
  throw new Error('You tried to require an unpermitted package.');
}

function openDevTools (evt, opts, externalWindow) {
  evt.sender.openDevTools(opts);
  if (externalWindow) {
    let devToolsWindow = new BrowserWindow({
      webContents: evt.sender.devToolsWebContents
    });
    devToolsWindow.on('ready-to-show', () => devToolsWindow.show());
    devToolsWindow.on('close', () => {
      evt.sender.closeDevTools();
      devToolsWindow = null;
    });
  }
}

function closeDevTools (evt) {
  evt.sender.closeDevTools();
}

function clearCache (evt) {
  return new Promise(resolve => {
    evt.sender.session.clearCache(() => resolve(null));
  });
}

function getHistory (evt) {
  return evt.sender.history;
}

function compileSass (_, file) {
  return new Promise((res, reject) => {
    readFile(file, 'utf8').then(rawScss => {
      const relativePath = relative(file, LIB_DIR);
      const absolutePath = resolve(join(file, relativePath));
      const fixedScss = rawScss.replace(VIZALITY_REGEX, `${join(absolutePath, '$1').replace(/\\/g, '/')}/`);
      sass.render(
        {
          data: fixedScss,
          importer: (url, prev) => {
            if (VIZALITY_REGEX.test(url)) {
              url = url.replace(VIZALITY_REGEX, `${join(absolutePath, '$1').replace(/\\/g, '/')}/`);
            }
            url = url.replace('file:///', '');
            if (existsSync(url)) {
              return { file: url };
            }
            const prevFile =
              prev === 'stdin'
                ? file
                : prev.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com/i, '');
            return {
              file: join(dirname(decodeURI(prevFile)), url).replace(/\\/g, '/')
            };
          }
        },
        (err, compiled) => {
          if (err) {
            return reject(err);
          }
          res(compiled.css.toString());
        }
      );
    });
  });
}

ipcMain.on('VIZALITY_GET_PRELOAD', evt => evt.returnValue = evt.sender._preload);
ipcMain.handle('VIZALITY_APP_HISTORY', getHistory);
ipcMain.handle('VIZALITY_APP_OPEN_DEVTOOLS', openDevTools);
ipcMain.handle('VIZALITY_APP_CLOSE_DEVTOOLS', closeDevTools);
ipcMain.handle('VIZALITY_APP_CACHE_CLEAR', clearCache);
ipcMain.handle('VIZALITY_WINDOW_IS_MAXIMIZED', evt => BrowserWindow.fromWebContents(evt.sender).isMaximized());
ipcMain.handle('VIZALITY_COMPILE_SASS', compileSass);
