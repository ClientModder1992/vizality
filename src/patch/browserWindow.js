const { BrowserWindow } = require('electron');
const { join } = require('path');

let experimentalWebPlatform = false;
let transparency = false;
let settings = {};

try {
  settings = require(join(__dirname, '..', '..', 'settings', 'vz-settings.json'));

  transparency = settings.transparentWindow;
  ({ experimentalWebPlatform } = settings);
} catch (err) {
  // @todo Handle this.
}

module.exports = class PatchedBrowserWindow extends BrowserWindow {
  constructor (opts) {
    let originalPreload;
    if (opts.webContents) {
      // General purpose popout windows used by Discord
    } else if (opts.webPreferences && (opts.webPreferences.nodeIntegration || opts.webPreferences.preload?.endsWith('splashScreenPreload.js'))) {
      // Splash Screen
      originalPreload = opts.webPreferences.preload;
      opts.webPreferences.preload = join(__dirname, '..', 'preload', 'splash.js');
    } else if (opts.webPreferences && opts.webPreferences.offscreen) {
      // Overlay
      originalPreload = opts.webPreferences.preload;
      // opts.webPreferences.preload = join(__dirname, '..', 'preload', 'main.js');
    } else if (opts.webPreferences && opts.webPreferences.preload?.endsWith('mainScreenPreload.js')) {
      // Discord Client
      originalPreload = opts.webPreferences.preload;
      opts.webPreferences.preload = join(__dirname, '..', 'preload', 'main.js');

      if (transparency) {
        opts.transparent = true;
        opts.frame = process.platform === 'win32' ? false : opts.frame;
        delete opts.backgroundColor;
      }

      if (experimentalWebPlatform) {
        opts.webPreferences.experimentalFeatures = true;
      }
    }

    const win = new BrowserWindow(opts);
    const originalLoadUrl = win.loadURL.bind(win);
    Object.defineProperty(win, 'loadURL', {
      get: () => PatchedBrowserWindow.loadUrl.bind(win, originalLoadUrl),
      configurable: true
    });

    win.on('maximize', () => win.webContents.send('VIZALITY_WINDOW_MAXIMIZE'));
    win.on('unmaximize', () => win.webContents.send('VIZALITY_WINDOW_UNMAXIMIZE'));

    /*
     * The following code was given by Lighty, thanks Lighty!
     */
    win.webContents.on('devtools-opened', async () => {
      const dtwc = win.webContents.devToolsWebContents;
      // Please tell me there is a better way of doing this?
      await dtwc.executeJavaScript(`(${(() => {
        if (localStorage.experiments) {
          localStorage.experiments = JSON.stringify(
            Object.assign(
              JSON.parse(localStorage.experiments),
              { sourcesPrettyPrint: true }
            )
          );
        } else {
          localStorage.experiments = '{"sourcesPrettyPrint":true}';
        }

        const { settings } = window.Common;

        settings.moduleSetting('jsSourceMapsEnabled').set(false);
        settings.moduleSetting('cssSourceMapsEnabled').set(false);
      }).toString()})()`);
      console.log('Auto sources pretty print enabled, js and css source maps disabled.');
    });

    win.webContents._preload = originalPreload;
    return win;
  }

  static loadUrl (originalLoadUrl, url, opts) {
    if ((/^https:\/\/discord(app)?\.com\/vizality/).test(url)) {
      console.log('YES');
      this.webContents.vizalityOriginalUrl = url;
      return originalLoadUrl('https://discordapp.com/app', opts);
    }
    return originalLoadUrl(url, opts);
  }
};
