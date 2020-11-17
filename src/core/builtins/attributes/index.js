/* eslint-disable quote-props */
const { ipcRenderer } = require('electron');

const { Builtin } = require('@vizality/entities');

const modules = require('./modules');

module.exports = class Attributes extends Builtin {
  onStart () {
    this.callbacks = [];

    Object.values(modules).forEach(async mdl => {
      const callback = typeof await mdl();
      if (typeof callback === 'function') {
        this.callbacks.push(callback);
      }
    });

    const root = document.documentElement;
    const date = new Date();

    // @todo Move these to Vizality startup and do this for all settings on startup
    if (vizality.settings.get('transparentWindow')) {
      const attrs = root.getAttribute('vz-settings');
      console.log(root.getAttribute('vz-settings'));
      root.setAttribute('vz-settings', [ attrs, 'transparent-window' ].filter(Boolean).join(', '));
      console.log(root.getAttribute('vz-settings'));
    }

    if (vizality.settings.get('experimentalWebPlatform')) {
      const attrs = root.getAttribute('vz-settings');
      console.log(root.getAttribute('vz-settings'));
      root.setAttribute('vz-settings', [ attrs, 'experimental-web-platform' ].filter(Boolean).join(', '));
      console.log(root.getAttribute('vz-settings'));
    }

    root.setAttribute('vizality', '');

    if (window.__OVERLAY__) root.setAttribute('vz-overlay', '');
    if (date.getMonth() === 1 && date.getDate() === 1) root.setAttribute('vz-holiday', 'new-years');
    if (date.getMonth() === 3 && date.getDate() === 1) root.setAttribute('vz-holiday', 'april-fools');
    if (date.getMonth() === 10 && date.getDate() === 31) root.setAttribute('vz-holiday', 'halloween');
    if (date.getMonth() === 12 && date.getDate() === 25) root.setAttribute('vz-holiday', 'christmas');

    ipcRenderer.invoke('VIZALITY_WINDOW_IS_MAXIMIZED').then(isMaximized => {
      if (isMaximized) root.setAttribute('vz-window', 'maximized');
      else root.setAttribute('vz-window', 'restored');
    });

    ipcRenderer.on('VIZALITY_WINDOW_MAXIMIZE', () => root.setAttribute('vz-window', 'maximized'));
    ipcRenderer.on('VIZALITY_WINDOW_UNMAXIMIZE', () => root.setAttribute('vz-window', 'restored'));
  }

  onStop () {
    this.callbacks.forEach(cb => cb());
  }
};
