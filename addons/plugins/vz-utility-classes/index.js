const { Plugin } = require('@entities');

const { remote } = require('electron');

const modules = require('./modules');

class UtilityClasses extends Plugin {
  onStart () {
    this.callbacks = [];

    Object.values(modules).forEach(async mod => {
      const callback = await mod();
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
      }
    });

    document.documentElement.setAttribute('vizality', '');

    if (window.__OVERLAY__) {
      document.documentElement.setAttribute('vz-overlay', '');
    }

    const webPrefs = remote.getCurrentWebContents().getWebPreferences();
    const currentWindow = remote.getCurrentWindow();

    if (webPrefs.transparent) {
      document.documentElement.setAttribute('vz-transparent', '');
    }

    if (webPrefs.experimentalFeatures) {
      document.documentElement.setAttribute('vz-experimental-web-features', '');
    }

    const date = new Date();

    if (date.getMonth() === 1 && date.getDate() === 1) {
      document.documentElement.setAttribute('vz-new-years', '');
    }

    if (date.getMonth() === 3 && date.getDate() === 1) {
      document.documentElement.setAttribute('vz-april-fools', '');
    }

    if (date.getMonth() === 10 && date.getDate() === 31) {
      document.documentElement.setAttribute('vz-halloween', '');
    }

    if (date.getMonth() === 12 && date.getDate() === 25) {
      document.documentElement.setAttribute('vz-christmas', '');
    }

    if (currentWindow.isMaximized()) {
      document.documentElement.setAttribute('vz-window', 'maximized');
    } else {
      document.documentElement.setAttribute('vz-window', 'restored');
    }

    currentWindow.on('maximize', () => document.documentElement.setAttribute('vz-window', 'maximized'));
    currentWindow.on('unmaximize', () => document.documentElement.setAttribute('vz-window', 'restored'));
  }

  onStop () {
    this.callbacks.forEach(cb => cb());
  }
}

module.exports = UtilityClasses;

