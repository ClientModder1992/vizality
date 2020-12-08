/* eslint-disable no-unused-vars */
const { ipcRenderer } = require('electron');

if (!ipcRenderer) {
  throw new Error('Don\'t require stuff you shouldn\'t, silly.');
}

// Name doesn't really matter here, because we get rid of it on startup
global.VizalityNative = {
  app: {
    /**
     * Open DevTools for the current window
     * @param {object} opts Options to pass to Electron
     * @param {boolean} externalWindow Whether the DevTools should be opened in an external window or not
     */
    openDevTools (opts, externalWindow) {
      return ipcRenderer.invoke('VIZALITY_APP_OPEN_DEVTOOLS', opts, externalWindow);
    },

    /**
     * Closes DevTools for the current window
     */
    closeDevTools () {
      return ipcRenderer.invoke('VIZALITY_APP_CLOSE_DEVTOOLS');
    },

    /**
     * Clears Chromium's cache
     * @returns {Promise<void>}
     */
    clearCache () {
      return ipcRenderer.invoke('VIZALITY_APP_CACHE_CLEAR');
    },

    openBrowserWindow (opts) {
      throw new Error('Not implemented');
    },

    getHistory () {
      return ipcRenderer.invoke('VIZALITY_APP_HISTORY');
    }
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
      case '@vizality/modal':
      case 'electron':
        return require(module);
      default:
        // @todo Use @vizality/constants.ErrorTypes
        throw new Error('Unknown module.');
    }
  };
}
