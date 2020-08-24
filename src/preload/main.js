require('module-alias/register');
const electron = require('electron');
const path = require('path');
const fs = require('fs');
const Constants = require('@constants');

electron.contextBridge.exposeInMainWorld = () => void 0;

require('../ipc/renderer');

// Initialize Vizality
const Vizality = require('../.vizality');
global.vizality = new Vizality();

// https://github.com/electron/electron/issues/9047
if (process.platform === 'darwin' && !process.env.PATH.includes('/usr/local/bin')) {
  process.env.PATH += ':/usr/local/bin';
}

// Discord's preload
const preload = electron.ipcRenderer.sendSync('VIZALITY_GET_PRELOAD');

if (preload) {
  require(preload);
}

/* @todo: Redo debug logging section below because it's gross. */

// Debug logging
let debugLogs;
try {
  const settings = require(path.join(Constants.Directories.SETTINGS, 'vz-general.json'));
  // eslint-disable-next-line prefer-destructuring
  debugLogs = settings.debugLogs;
} finally {
  if (debugLogs) {
    if (!fs.existsSync(Constants.Directories.LOGS)) {
      fs.mkdirSync(Constants.Directories.LOGS, { recursive: true });
    }
    const getDate = () => new Date().toISOString().replace('T', ' ').split('.')[0];
    const filename = `${window.__OVERLAY__ ? 'overlay' : 'discord'}-${new Date().toISOString().replace('T', '_').replace(/:/g, '-').split('.')[0]}.txt`;
    const logsPath = path.join(Constants.Directories.LOGS, filename);
    console.log('[Vizality] Debug logs enabled. Logs will be saved in', logsPath);
    fs.open(logsPath, 'w', (_, fd) => {
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
          fs.write(fd, `[${getDate()}] [CONSOLE] [${levels[key]}] ${cleaned.join(' ')}\n`, 'utf8', () => void 0);
          ogFunction.call(console, ...args);
        };
      }

      // Add listeners
      process.on('uncaughtException', ev => fs.write(fd, `[${getDate()}] [PROCESS] [ERROR] Uncaught Exception: ${ev.error}\n`, 'utf8', () => void 0));
      process.on('unhandledRejection', ev => fs.write(fd, `[${getDate()}] [PROCESS] [ERROR] Unhandled Rejection: ${ev.reason}\n`, 'utf8', () => void 0));
      window.addEventListener('error', ev => fs.write(fd, `[${getDate()}] [WINDOW] [ERROR] ${ev.error}\n`, 'utf8', () => void 0));
      window.addEventListener('unhandledRejection', ev => fs.write(fd, `[${getDate()}] [WINDOW] [ERROR] Unhandled Rejection: ${ev.reason}\n`, 'utf8', () => void 0));
    });
  }
}

// Overlay devtools
vizality.once('initialized', () => {
  if (window.__OVERLAY__ && vizality.api.settings.store.getSetting('vz-general', 'openOverlayDevTools', false)) {
    VizalityNative.openDevTools();
  }
});
