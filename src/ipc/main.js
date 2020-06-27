const { ipcMain } = require('electron');

if (!ipcMain) {
  throw new Error('Don\'t require stuff you shouldn\'t silly.');
}

ipcMain.on('VIZALITY_GET_PRELOAD', e => e.returnValue = e.sender._preload);