const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');
const { join, dirname, normalize } = require('path');
const electron = require('electron');
const Module = require('module');

/*
 * This /should/ be fixed now, but leaving this here temporarily just in case.
 * https://github.com/electron/electron/issues/19468#issuecomment-549593139
 * if (process.platform === 'win32') {
 *   const DevToolsExtensions = join(electron.app.getPath('userData'), 'DevTools Extensions');
 *   try {
 *     unlinkSync(DevToolsExtensions);
 *   } catch (err) {
 *     // Do nothing
 *   }
 * }
 */

require('../ipc/main');

const discordPath = join(dirname(require.main.filename), '..', 'app.asar');
const PatchedBrowserWindow = require('./browserWindow');
const electronPath = require.resolve('electron');

// Restore the classic path; the updater relies on it and it makes Discord go corrupt
require.main.filename = join(discordPath, 'app_bootstrap', 'index.js');

let _patched = false;
const appSetAppUserModelId = electron.app.setAppUserModelId;
function setAppUserModelId (...args) {
  /*
   * Once this has been called, we can assume squirrelUpdate is safe to require
   * as everything that needs to be initialized has been initialized.
   */
  appSetAppUserModelId.apply(this, args);
  if (!_patched) {
    _patched = true;
    require('../update/win32');
  }
}

electron.app.setAppUserModelId = setAppUserModelId;

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

electron.protocol.registerSchemesAsPrivileged([
  { scheme: 'vz-plugin', privileges: { standard: true, secure: true } },
  { scheme: 'vz-theme', privileges: { standard: true, secure: true } },
  { scheme: 'vz-builtin', privileges: { standard: true, secure: true } }
]);

electron.app.once('ready', () => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name) => console.log(`Added Extension:  ${name}`))
    .catch((err) => console.log('An error occurred: ', err));
  // @todo Possibly add whitelists instead of just disabling CSP.
  electron.session.defaultSession.webRequest.onHeadersReceived(({ responseHeaders }, done) => {
    Object.keys(responseHeaders)
      .filter(k => (/^content-security-policy/i).test(k) || (/^x-frame-options/i).test(k))
      .map(k => (delete responseHeaders[k]));

    done({ responseHeaders });
  });

  const urlRegex = /^(https:\/\/(?:canary|ptb)?.?discord(app)?\.com)\/vizality\//;

  electron.session.defaultSession.webRequest.onBeforeRequest((details, done) => {
    if (urlRegex.test(details.url)) {
      // It should get restored to the vizality url later.
      done({ redirectURL: `${details.url.match(urlRegex)[1]}/app` });
    } else {
      done({});
    }
  });

  const registerProtocol = (name, folder) => {
    electron.protocol.registerFileProtocol(name, (request, cb) => {
      // https://security.stackexchange.com/a/123723
      const [ url ] = normalize(request.url.replace(`${name}://`, '')).replace(/^(\.\.(\/|\\|$))+/, '').split('?');
      if (folder === 'builtins') {
        return cb({ path: join(__dirname, '..', 'core', 'builtins', folder, url) });
      }
      return cb({ path: join(__dirname, '..', '..', 'addons', folder, url) });
    });
  };

  registerProtocol('vz-plugin', 'plugins');
  registerProtocol('vz-theme', 'themes');
  registerProtocol('vz-builtin', 'builtins');
});

const discordPackage = require(join(discordPath, 'package.json'));
electron.app.setAppPath(discordPath);
electron.app.name = discordPackage.name;

Module._load(join(discordPath, discordPackage.main), null, true);
