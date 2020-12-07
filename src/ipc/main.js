const { existsSync, createWriteStream, promises: { readFile } } = require('fs');
const { relative, join, dirname, resolve } = require('path');
const { ipcMain, BrowserWindow } = require('electron');
const sass = require('sass');

const VIZALITY_REGEX = new RegExp('@vizality\\/([^\'"]{1,})?', 'ig');
const BASE_DIR = `${join(__dirname, '..', '..')}\\`;
const LIB_DIR = `${join(__dirname, '..', 'core', 'lib')}\\`;

if (!ipcMain) {
  throw new Error('Don\'t require stuff you shouldn\'t silly.');
}

function openDevTools (e, opts, externalWindow) {
  e.sender.openDevTools(opts);
  if (externalWindow) {
    if (externalWindow) {
      let devToolsWindow = new BrowserWindow({
        webContents: e.sender.devToolsWebContents
      });
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
  return new Promise((resolve) => {
    e.sender.session.clearCache(() => resolve(null));
  });
}

const logger = createWriteStream(join(BASE_DIR, 'main.log'), {
  flags: 'a',
  encoding: 'utf8'
});

/* EXPERIMENTAL */
// eslint-disable-next-line no-unused-vars
function logToFile (str) {
  logger.write(`${new Date().toISOString()} | INFO | ${str}\n`, (err) => {
    if (err) {
      console.error(err);
    }
  });
}

function compileSass (_, file) {
  return new Promise((res, reject) => {
    readFile(file, 'utf8').then((rawScss) => {
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

ipcMain.on('VIZALITY_GET_PRELOAD', e => e.returnValue = e.sender._preload);
ipcMain.on('VIZALITY_GET_HISTORY', e => e.returnValue = e.sender.history);
ipcMain.handle('VIZALITY_OPEN_DEVTOOLS', openDevTools);
ipcMain.handle('VIZALITY_CLOSE_DEVTOOLS', closeDevTools);
ipcMain.handle('VIZALITY_CACHE_CLEAR', clearCache);
ipcMain.handle('VIZALITY_COMPILE_SASS', compileSass);
ipcMain.handle('VIZALITY_WINDOW_IS_MAXIMIZED', e => BrowserWindow.fromWebContents(e.sender).isMaximized());
