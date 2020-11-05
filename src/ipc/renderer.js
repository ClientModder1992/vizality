/* eslint-disable no-unused-vars */

const { ipcRenderer } = require('electron');

if (!ipcRenderer) {
  throw new Error('Don\'t require stuff you shouldn\'t, silly.');
}

global.VizalityNative = {
  /**
   * Open DevTools for the current window
   * @param {object} opts Options to pass to Electron
   * @param {boolean} externalWindow Whether the DevTools should be opened in an external window or not.
   */
  openDevTools (opts, externalWindow) {
    return ipcRenderer.invoke('VIZALITY_OPEN_DEVTOOLS', opts, externalWindow);
  },

  /**
   * Closes DevTools for the current window
   */
  closeDevTools () {
    return ipcRenderer.invoke('VIZALITY_CLOSE_DEVTOOLS');
  },

  /**
   * Clears Chromium's cache
   * @returns {Promise<void>}
   */
  clearCache () {
    return ipcRenderer.invoke('VIZALITY_CACHE_CLEAR');
  },

  openBrowserWindow (opts) {
    throw new Error('Not implemented');
  },

  __compileSass (file) {
    return ipcRenderer.invoke('VIZALITY_COMPILE_SASS', file);
  }
};

if (!window.__SPLASH__) {
  window.require = module => {
    switch (module) {
      case '@vizality/classes':
      case '@vizality/components':
      case '@vizality/constants':
      case '@vizality/discord':
      case '@vizality/http':
      case '@vizality/i18n':
      case '@vizality/patcher':
      case '@vizality/react':
      case '@vizality/util':
      case '@vizality/webpack':
      case 'electron':
        return require(module);
      default:
        // @todo Use @vizality/constants.ErrorTypes
        throw new Error('Unknown module.');
    }
  };
}
