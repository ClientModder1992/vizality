const { existsSync, promises: { readFile } } = require('fs');
const { ipcMain, BrowserWindow } = require('electron');
const { relative, join, dirname } = require('path');
const sass = require('sass');

const VIZALITY_REGEX = new RegExp('@vizality\\/(\\/[^\'"]{1,})?', 'ig');
const BASE_DIR = `${join(__dirname, '..', 'core', 'lib')}\\`;

if (!ipcMain) {
  throw new Error('Don\'t require stuff you shouldn\'t silly.');
}

function openDevTools (e, opts, externalWindow) {
  e.sender.openDevTools(opts);
  if (externalWindow) {
    if (externalWindow) {
      let devToolsWindow = new BrowserWindow({ webContents: e.sender.devToolsWebContents });
      devToolsWindow.on('ready-to-show', () => devToolsWindow.show());
      devToolsWindow.on('close', () => {
        e.sender.closeDevTools();
        devToolsWindow = null;
      });
    }
  }
}

function closeDevTools (e) {
  e.sender.closeDevTools();
}

function clearCache (e) {
  return new Promise(resolve => {
    e.sender.session.clearCache(() => resolve(null));
  });
}

function compileSass (_, file) {
  return new Promise((resolve, reject) => {
    readFile(file, 'utf8').then(rawScss => {
      const relativePath = relative(file, BASE_DIR);
      rawScss = rawScss.replace(VIZALITY_REGEX, join(relativePath, '$1'));
      sass.render({
        data: rawScss,
        importer: (url, prev) => {
          url = url.replace('file:///', '');
          if (existsSync(url)) {
            return { file: url };
          }
          const prevFile = prev === 'stdin' ? file : prev.replace(/https?:\/\/(?:[a-z]+\.)?discord(?:app)?\.com/i, '');
          return {
            file: join(dirname(decodeURI(prevFile)), url).replace(/\\/g, '/')
          };
        }
      }, (err, compiled) => {
        if (err) {
          return reject(err);
        }
        resolve(compiled.css.toString());
      });
    });
  });
}

ipcMain.on('VIZALITY_GET_PRELOAD', e => e.returnValue = e.sender._preload);
ipcMain.handle('VIZALITY_OPEN_DEVTOOLS', openDevTools);
ipcMain.handle('VIZALITY_CLOSE_DEVTOOLS', closeDevTools);
ipcMain.handle('VIZALITY_CACHE_CLEAR', clearCache);
ipcMain.handle('VIZALITY_COMPILE_SASS', compileSass);
