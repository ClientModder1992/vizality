require('module-alias/register');

require('../ipc/renderer');

window.__SPLASH__ = true;

/*
 * CSS Injection
 * @todo Use the new manager.themes for this.
 */
const initialize = () => {
  document.documentElement.setAttribute('vizality', '');
  const StyleManager = require('../.vizality/managers/styleManager');
  global.sm = new StyleManager();
  global.sm.start();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
