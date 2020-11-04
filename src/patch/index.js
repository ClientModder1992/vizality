const PatchedBrowserWindow = require('./browserWindow');
const { join, dirname } = require('path');
const electron = require('electron');
const Module = require('module');

require('../update');
require('../ipc/main');

const electronPath = require.resolve('electron');
const discordPath = join(dirname(require.main.filename), '..', 'app.asar');

// Restore the classic path; The updater relies on it and it makes Discord go corrupt
require.main.filename = join(discordPath, 'app_bootstrap/index.js');

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
  // @todo Possibly add whitelists instead of just disabling CSP.
  electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => {
    Object.keys(responseHeaders)
      .filter(k => (/^content-security-policy/i).test(k) || (/^x-frame-options/i).test(k))
      .map(k => (delete responseHeaders[k]));

    done({ responseHeaders });
  });

  electron.session.defaultSession.webRequest.onBeforeRequest((details, done) => {
    if (new RegExp(/^https:\/\/discord(app)?\.com\/vizality\//).test(details.url)) {
      // It should get restored to the vizality url later.
      done({ redirectURL: 'https://discord.com/app' });
    } else {
      done({});
    }
  });
});

const discordPackage = require(join(discordPath, 'package.json'));
electron.app.setAppPath(discordPath);
electron.app.name = discordPackage.name;

Module._load(join(discordPath, discordPackage.main), null, true);
