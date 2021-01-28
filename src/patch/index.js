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

let reactDeveloperTools = false;
let settings = {};

try {
  settings = require(join(__dirname, '..', '..', 'settings', 'vz-settings.json'));

  ({ reactDeveloperTools } = settings);
} catch (err) {
  // @todo Handle this.
}

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
  {
    scheme: 'vz-plugin',
    privileges: {
      supportFetchAPI: true,
      corsEnabled: true,
      standard: true,
      secure: true
    }
  },
  {
    scheme: 'vz-theme',
    privileges: {
      supportFetchAPI: true,
      corsEnabled: true,
      standard: true,
      secure: true
    }
  },
  {
    scheme: 'vz-builtin',
    privileges: {
      supportFetchAPI: true,
      corsEnabled: true,
      standard: true,
      secure: true
    }
  },
  {
    scheme: 'vz-asset',
    privileges: {
      supportFetchAPI: true,
      corsEnabled: true,
      standard: true,
      secure: true
    }
  }
]);

electron.app.once('ready', () => {
  if (reactDeveloperTools) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => console.log('An error occurred: ', err));
  }
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

  const registerProtocol = name => {
    electron.protocol.registerFileProtocol(name, (request, cb) => {
      // https://security.stackexchange.com/a/123723
      const [ url ] = normalize(request.url.replace(`${name}://`, '')).replace(/^(\.\.(\/|\\|$))+/, '').split('?');

      switch (name) {
        case 'vz-asset':
          return cb({ path: join(__dirname, '..', 'core', 'assets', url) });
        case 'vz-builtin':
          return cb({ path: join(__dirname, '..', 'core', 'builtins', url) });
        case 'vz-theme':
          return cb({ path: join(__dirname, '..', '..', 'addons', 'themes', url) });
        case 'vz-plugin':
          return cb({ path: join(__dirname, '..', '..', 'addons', 'plugins', url) });
      }
    });
  };

  registerProtocol('vz-asset');
  registerProtocol('vz-builtin');
  registerProtocol('vz-theme');
  registerProtocol('vz-plugin');
});

const discordPackage = require(join(discordPath, 'package.json'));
electron.app.setAppPath(discordPath);
electron.app.name = discordPackage.name;

Module._load(join(discordPath, discordPackage.main), null, true);
