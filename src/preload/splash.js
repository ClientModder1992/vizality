window.__SPLASH__ = true;

require('../ipc/renderer');

/*
 * Theme injection
 */
const initialize = () => {
  document.documentElement.setAttribute('vizality', '');
  const ThemeManager = require('../core/managers/Theme');
  window.sm = new ThemeManager();
  window.sm.start();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}
