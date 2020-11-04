const { BrowserWindow } = require('electron');
const { join } = require('path');

let experimentalWebPlatform = false;
let transparency = false;
let settings = {};

try {
  settings = require(join(__dirname, '..', '..', 'settings', 'settings.json'));

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
    } else if (opts.webPreferences && opts.webPreferences.nodeIntegration) {
      // Splash Screen
      opts.webPreferences.preload = join(__dirname, '..', 'preload', 'splash.js');
    } else if (opts.webPreferences && opts.webPreferences.offscreen) {
      // Overlay
      originalPreload = opts.webPreferences.preload;
      // opts.webPreferences.preload = join(__dirname, '..', 'preload', 'main.js');
      // opts.webPreferences.nodeIntegration = true;
    } else if (opts.webPreferences && opts.webPreferences.preload) {
      // Discord Client
      originalPreload = opts.webPreferences.preload;
      opts.webPreferences.preload = join(__dirname, '..', 'preload', 'main.js');
      // opts.webPreferences.nodeIntegration = true;
      // @todo Get rid of this.
      opts.webPreferences.contextIsolation = false;

      if (transparency) {
        opts.transparent = true;
        opts.frame = process.platform === 'win32' ? false : opts.frame;
        delete opts.backgroundColor;
      }

      if (experimentalWebPlatform) {
        opts.webPreferences.experimentalFeatures = true;
      }
    }

    // @todo Get rid of this.
    opts.webPreferences.enableRemoteModule = true;
    const win = new BrowserWindow(opts);
    const originalLoadUrl = win.loadURL.bind(win);
    Object.defineProperty(win, 'loadURL', {
      get: () => PatchedBrowserWindow.loadUrl.bind(win, originalLoadUrl),
      configurable: true
    });

    win.webContents._preload = originalPreload;
    return win;
  }

  static loadUrl (originalLoadUrl, url, opts) {
    if (url.match(/^https:\/\/discord(app)?\.com\/vizality\//)) {
      this.webContents.vizalityOriginalUrl = url;
      return originalLoadUrl('https://discordapp.com/app', opts);
    }
    return originalLoadUrl(url, opts);
  }
};
