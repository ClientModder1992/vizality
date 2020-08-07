/* global appSettings */
const PatchedBrowserWindow = require('./browserWindow');
const { existsSync, unlinkSync } = require('fs');
const { join, dirname } = require('path');
const electron = require('electron');
const Module = require('module');

require('../ipc/main');

const electronPath = require.resolve('electron');
const discordPath = join(dirname(require.main.filename), '..', 'app.asar');

const electronExports = new Proxy(electron, {
  get (target, prop) {
    switch (prop) {
      case 'BrowserWindow': return PatchedBrowserWindow;
      default: return target[prop];
    }
  }
});

delete require.cache[electronPath].exports;
require.cache[electronPath].exports = electronExports;

electron.app.once('ready', () => {
  electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => {
    Object.keys(responseHeaders)
      .filter(k => (/^content-security-policy/i).test(k) || (/^x-frame-options/i).test(k))
      .map(k => (delete responseHeaders[k]));

    done({ responseHeaders });
  });

  electron.session.defaultSession.webRequest.onBeforeRequest((details, done) => {
    if (details.url.startsWith('https://discord.com/_vizality')) {
      appSettings.set('_VIZALITY_ROUTE', details.url.replace('https://discord.com', ''));
      appSettings.save();
      // It should get restored to the _vizality url later.
      done({ redirectURL: 'https://discord.com' });
    } else {
      done({});
    }
  });
});

const discordPackage = require(join(discordPath, 'package.json'));
electron.app.setAppPath(discordPath);
electron.app.name = discordPackage.name;

/**
 * Bandaid fix for Windows users involving DevTools extensions.
 * @see https://github.com/electron/electron/issues/19468
 */
if (process.platform === 'win32') {
  setImmediate(() => { // The app name apparently doesn't get set instantly...
    const devToolsExtensions = join(electron.app.getPath('userData'), 'DevTools Extensions');

    if (existsSync(devToolsExtensions)) {
      unlinkSync(devToolsExtensions);
    }
  });
}

Module._load(join(discordPath, discordPackage.main), null, true);
