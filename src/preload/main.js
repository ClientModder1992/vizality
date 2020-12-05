const { existsSync, mkdirSync, open, write } = require('fs');
const { ipcRenderer, contextBridge } = require('electron');
const { join } = require('path');

require('module-alias/register');
require('../ipc/renderer');

const { Directories } = require('@vizality/constants');

// Initialize Vizality
const Vizality = require('../core');
global.vizality = new Vizality();

// https://github.com/electron/electron/issues/9047
if (process.platform === 'darwin' && !process.env.PATH.includes('/usr/local/bin')) {
  process.env.PATH += ':/usr/local/bin';
}

// Discord's preload
const preload = ipcRenderer.sendSync('VIZALITY_GET_PRELOAD');

if (preload) {
  // Restore original preload for future windows
  process.electronBinding('command_line').appendSwitch('preload', preload);

  // Make sure DiscordNative gets exposed
  contextBridge.exposeInMainWorld = (key, val) => window[key] = val;

  require(preload);
}

/* @todo: Redo debug logging section below because it's gross. */

// Debug logging
let debugLogs;
let settings = {};

try {
  settings = require(join(Directories.SETTINGS, 'settings.json'));
  ({ debugLogs } = settings);
} catch (err) {
  // @todo Handle this.
}

if (debugLogs) {
  if (!existsSync(Directories.LOGS)) {
    mkdirSync(Directories.LOGS, { recursive: true });
  }
  const getDate = () => new Date().toISOString().replace('T', ' ').split('.')[0];
  const filename = `${window.__OVERLAY__ ? 'overlay' : 'discord'}-${new Date().toISOString().replace('T', '_').replace(/:/g, '-').split('.')[0]}.txt`;
  const path = join(Directories.LOGS, filename);
  console.log('[Vizality] Debug logs enabled. Logs will be saved in', path);
  open(path, 'w', (_, fd) => {
    // Patch console methods
    const levels = {
      debug: 'DEBUG',
      log: 'INFO',
      info: 'INFO',
      warn: 'WARN',
      error: 'ERROR'
    };
    for (const key of Object.keys(levels)) {
      const ogFunction = console[key].bind(console);
      console[key] = (...args) => {
        const cleaned = [];
        for (let i = 0; i < args.length; i++) {
          const part = args[i];
          if (typeof part === 'string' && part.includes('%c')) { // Remove console formatting
            cleaned.push(part.replace(/%c/g, ''));
            i++;
          } else if (part instanceof Error) { // Errors
            cleaned.push(part.message);
          } else if (typeof part === 'object') { // Objects
            cleaned.push(JSON.stringify(part));
          } else {
            cleaned.push(part);
          }
        }
        write(fd, `[${getDate()}] [CONSOLE] [${levels[key]}] ${cleaned.join(' ')}\n`, 'utf8', () => void 0);
        ogFunction.call(console, ...args);
      };
    }

    // Add listeners
    process.on('uncaughtException', ev => write(fd, `[${getDate()}] [PROCESS] [ERROR] Uncaught Exception: ${ev.error}\n`, 'utf8', () => void 0));
    process.on('unhandledRejection', ev => write(fd, `[${getDate()}] [PROCESS] [ERROR] Unhandled Rejection: ${ev.reason}\n`, 'utf8', () => void 0));
    window.addEventListener('error', ev => write(fd, `[${getDate()}] [WINDOW] [ERROR] ${ev.error}\n`, 'utf8', () => void 0));
    window.addEventListener('unhandledRejection', ev => write(fd, `[${getDate()}] [WINDOW] [ERROR] Unhandled Rejection: ${ev.reason}\n`, 'utf8', () => void 0));
  });
}

// Overlay devtools
vizality.once('initialized', () => {
  if (window.__OVERLAY__ && vizality.api.settings.store.getSetting('settings', 'openOverlayDevTools', false)) {
    vizality.native.openDevTools({}, true);
  }
});
