const { join } = require('path');

window.__SPLASH__ = true;

// Add Vizality's modules
require('module').Module.globalPaths.push(join(__dirname, 'fake_node_modules'));

// CSS Injection
function init () {
  document.documentElement.setAttribute('vizality', '');
  const StyleManager = require('./Vizality/managers/styles');
  global.sm = new StyleManager();
  global.sm.loadThemes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

