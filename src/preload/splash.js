require('module-alias/register');

require('../ipc/renderer');

window.__SPLASH__ = true;

// CSS Injection
function init () {
  document.documentElement.setAttribute('vizality', '');
  const StyleManager = require('../Vizality/managers/styleManager');
  global.sm = new StyleManager();
  global.sm.loadThemes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
