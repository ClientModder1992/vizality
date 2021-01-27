const { ipcRenderer, webFrame } = require('electron');
const { join } = require('path');
require('module-alias/register');

function copyProp (name, reverse = false) {
  Object.defineProperty(reverse ? webFrame.top.context : window, name, {
    get: () => (reverse ? window : webFrame.top.context)[name]
  });
}

function fixDocument () {
  const realDoc = webFrame.top.context.document;
  let i = 0;

  // Allow accessing React root container
  Object.defineProperty(HTMLElement.prototype, '_reactRootContainer', {
    get () {
      i++;
      this.dataset.vzReactRoot = i;
      const elem = realDoc.querySelector(`[data-vz-react-root="${i}"]`);
      elem.removeAttribute('data-vz-react-root');
      return elem._reactRootContainer;
    }
  });
}

// Bypass the context isolation
copyProp('DiscordSentry');
copyProp('__SENTRY__');
copyProp('GLOBAL_ENV');
copyProp('_');

fixDocument();


require('@vizality/compilers');
require('../ipc/renderer');

(() => {
  const { Module } = require('module');
  const extensions = [ '.jsx', '.js', '.ts', '.tsx' ];
  for (const ext of extensions) {
    const oldRequireExt = Module._extensions[ext];
    Module._extensions[ext] = (module, filename) => {
      const coreDir = join(__dirname, '..', 'core');
      const addonsDir = join(__dirname, '..', '..', 'addons');
      if ((filename.indexOf(coreDir) &&
          filename.indexOf(addonsDir)) ||
          filename.indexOf('node_modules') !== -1
      ) {
        return oldRequireExt(module, filename);
      }

      const compiler = new (require(`@vizality/compilers/${ext.substring(1).toUpperCase()}`))(filename);
      const compiled = compiler.compile();
      module._compile(compiled, filename);
    };
  }
})();

// Needs to be after module-alias is registered and compilation is defined
const { Events } = require('@vizality/constants');

// Initialize Vizality
const Vizality = require('../core').default;

window.vizality = new Vizality();

copyProp('vizality', true);
copyProp('require', true);

// https://github.com/electron/electron/issues/9047
if (process.platform === 'darwin' && !process.env.PATH.includes('/usr/local/bin')) {
  process.env.PATH += ':/usr/local/bin';
}

// Discord's preload
const preload = ipcRenderer.sendSync('VIZALITY_GET_PRELOAD');
if (preload) {
  // Restore original preload for future windows
  process.electronBinding('command_line').appendSwitch('preload', preload);

  require(preload);
}

/* @todo Add debug logging. */

// Overlay devtools
vizality.once(Events.VIZALITY_SETTINGS_READY, () => {
  if (window.__OVERLAY__ && vizality.settings.get('openOverlayDevTools', false)) {
    vizality.native.openDevTools({}, true);
  }
});
