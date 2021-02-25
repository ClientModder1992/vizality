const { existsSync, mkdirSync } = require('fs');
const { BrowserWindow } = require('electron');
const { join } = require('path');

const SettingsDir = join(__dirname, '..', '..', 'settings');

let experimentalWebPlatform = false;
let transparentWindow = false;
let settings = {};

if (!existsSync(SettingsDir)) mkdirSync(SettingsDir);

/*
 * Retrieve some settings value so we can set them here.
 */
try {
  settings = require(join(SettingsDir, 'settings.json'));
  ({ experimentalWebPlatform, transparentWindow } = settings);
} catch (err) {}

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
      // Transparent window enabled
      if (transparentWindow) {
        opts.transparent = true;
        opts.frame = process.platform === 'win32' ? false : opts.frame;
        delete opts.backgroundColor;
      }
      // Experimental web platform enabled
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

    // Add events to use with IPC for window maximize and window restore
    win.on('maximize', () => win.webContents.send('VIZALITY_WINDOW_MAXIMIZE'));
    win.on('unmaximize', () => win.webContents.send('VIZALITY_WINDOW_UNMAXIMIZE'));

    /*
     * The following code was given by Lighty, thanks Lighty! Ugly, but it works.
     * We use this force set some default developer tool settings:
     * ---
     * Automatically pretty print sources - This is important, because without it, it is very
     * slow to load JavaScript sources in dev tools.
     * ---
     * Turn off JS and CSS source maps - Unneeded.
     */
    win.webContents.on('devtools-opened', async () => {
      const dtwc = win.webContents.devToolsWebContents;
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
