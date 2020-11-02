window.__SPLASH__ = true;

require('../ipc/renderer');

/*
 * CSS Injection
 * @todo Use the new manager.themes for this.
 */
const initialize = () => {
  document.documentElement.setAttribute('vizality', '');
  const StyleManager = require('../core/managers/styleManager');
  global.sm = new StyleManager();
  global.sm.start();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
