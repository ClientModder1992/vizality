const { ipcRenderer } = require('electron');
const { join } = require('path');
// Discord's preload
const preload = ipcRenderer.sendSync('VIZALITY_GET_PRELOAD');
if (preload) {
  require(preload);
}

window.__SPLASH__ = true;

require('module-alias/register');
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

/*
 * Theme injection
 */
const initialize = () => {
  document.documentElement.setAttribute('vizality', '');
  const ThemeManager = require('../core/managers/Theme').default;
  new ThemeManager();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
