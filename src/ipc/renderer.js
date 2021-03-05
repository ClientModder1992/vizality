/* eslint-disable no-unused-vars */
const { ipcRenderer } = require('electron');

// Name doesn't really matter here, because we get rid of it on startup
window.VizalityNative = {
  app: {
    /**
     * Opens Chrome Developer Tools for the current window.
     * @param {Object} options Options to pass to Electron
     * @param {boolean} externalWindow Whether the DevTools should be opened in an external window or not
     */
    openDevTools (options, externalWindow) {
      return ipcRenderer.invoke('VIZALITY_APP_OPEN_DEVTOOLS', options, externalWindow);
    },

    /**
     * Closes Chrome Developer Tools for the current window.
     */
    closeDevTools () {
      return ipcRenderer.invoke('VIZALITY_APP_CLOSE_DEVTOOLS');
    },

    /**
     * Clears Chromium's cache.
     * @returns {Promise<void>}
     */
    clearCache () {
      return ipcRenderer.invoke('VIZALITY_APP_CACHE_CLEAR');
    },

    openBrowserWindow (options) {
      throw new Error('Not implemented');
    },

    /**
     * Gets the path browsing history.
     * @returns {Promise<Array<string|null>>}
     */
    getHistory () {
      return ipcRenderer.invoke('VIZALITY_APP_HISTORY');
    }
  },

  /**
   * Compiles a Sass file.
   * @param {string} file File path to compile
   * @returns {Promise<void>}
   */
  __compileSass (file) {
    return ipcRenderer.invoke('VIZALITY_COMPILE_SASS', file);
  }
};

/*
 * Whitelist certain modules to be able to be required in Developer Tools console.
 */
if (!window.__SPLASH__) {
  window.require = module => {
    switch (module) {
      case '@vizality':
      case '@vizality/components':
      case '@vizality/constants':
      case '@vizality/discord':
      case '@vizality/http':
      case '@vizality/i18n':
      case '@vizality/patcher':
      case '@vizality/api':
      case '@vizality/entities':
      case '@vizality/util':
      case '@vizality/webpack':
      case '@vizality/modal':
      case '@vizality/modules':
      case 'react':
      case 'react-dom':
      case 'react-router':
        return require(module);
      default:
        // @todo Use @vizality/constants.ErrorTypes
        throw new Error('Module is not whitelisted and cannot be used in this scope.');
    }
  };
}
