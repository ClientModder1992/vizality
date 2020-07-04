const { ipcMain, BrowserWindow } = require('electron');

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

async function installExtension (e, extPath) {
  const ext = await e.sender.session.loadExtension(extPath);
  return ext.id;
}

function uninstallExtension (e, extId) {
  return e.sender.session.removeExtension(extId);
}

function clearCache (e) {
  return new Promise(resolve => {
    e.sender.session.clearCache(() => resolve(null));
  });
}

ipcMain.on('VIZALITY_GET_PRELOAD', e => e.returnValue = e.sender._preload);
ipcMain.handle('VIZALITY_OPEN_DEVTOOLS', openDevTools);
ipcMain.handle('VIZALITY_CLOSE_DEVTOOLS', closeDevTools);
ipcMain.handle('VIZALITY_INSTALL_EXTENSION', installExtension);
ipcMain.handle('VIZALITY_UNINSTALL_EXTENSION', uninstallExtension);
ipcMain.handle('VIZALITY_CACHE_CLEAR', clearCache);
