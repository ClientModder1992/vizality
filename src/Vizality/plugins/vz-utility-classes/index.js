const { remote } = require('electron');
const { Plugin } = require('vizality/entities');
const modules = require('./modules');

module.exports = class UtilityClasses extends Plugin {
  startPlugin () {
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
    if (webPrefs.transparent) {
      document.documentElement.setAttribute('vz-transparent', '');
    }
    if (webPrefs.experimentalFeatures) {
      document.documentElement.setAttribute('vz-experimental-web-features', '');
    }

    const date = new Date();
    if (date.getMonth() === 3 && date.getDate() === 1) {
      document.documentElement.setAttribute('vz-april-fools', '');
    }

    if (remote.getCurrentWindow().isMaximized()) document.documentElement.setAttribute('vz-window', 'maximized');
    else document.documentElement.setAttribute('vz-window', 'restored');

    remote.getCurrentWindow().on('maximize', () => document.documentElement.setAttribute('vz-window', 'maximized'));
    remote.getCurrentWindow().on('unmaximize', () => document.documentElement.setAttribute('vz-window', 'restored'));
  }

  pluginWillUnload () {
    this.callbacks.forEach(cb => cb());
  }
};
