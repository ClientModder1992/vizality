const { join } = require('path');
const { BrowserWindow } = require('electron');

let settings = {};
let transparency = false;
let ewp = false;
try {
  settings = require(join(__dirname, '../../settings/vz-general.json'));
} finally {
  transparency = settings.transparentWindow;
  ewp = settings.experimentalWebPlatform;
}

class PatchedBrowserWindow extends BrowserWindow {
  constructor (opts) {
    let originalPreload;
    if (opts.webContents) {
      // General purpose popouts used by Discord
    } else if (opts.webPreferences && opts.webPreferences.nodeIntegration) {
      // Splash Screen
      opts.webPreferences.preload = join(__dirname, '../preload/splash.js');
    } else if (opts.webPreferences && opts.webPreferences.offscreen) {
      // Overlay
      originalPreload = opts.webPreferences.preload;
      opts.webPreferences.preload = join(__dirname, '../preload/main.js');
      opts.webPreferences.nodeIntegration = true;
    } else if (opts.webPreferences && opts.webPreferences.preload) {
      // Discord Client
      originalPreload = opts.webPreferences.preload;
      opts.webPreferences.preload = join(__dirname, '../preload/main.js');
      opts.webPreferences.nodeIntegration = true;

      if (transparency) {
        opts.transparent = true;
        opts.frame = process.platform === 'win32' ? false : opts.frame;
        delete opts.backgroundColor;
      }

      if (ewp) {
        opts.webPreferences.experimentalFeatures = true;
      }
    }

    // @todo: get rid of this.
    opts.webPreferences.enableRemoteModule = true;
    const win = new BrowserWindow(opts);
    win.webContents._preload = originalPreload;
    return win;
  }
}

module.exports = PatchedBrowserWindow;
