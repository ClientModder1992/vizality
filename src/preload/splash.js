const { join } = require('path');

require('./ipc/renderer');

window.__SPLASH__ = true;

const mod = require('module');
// Add Vizality's modules
mod.Module.globalPaths.push(join(__dirname, '../Vizality/vizality_modules'));
// Add Powercord proxy
const originalModuleLoad = mod._load;
mod._load = function (request, parent, isMain) {
  if (!request.indexOf('powercord')) request = request.replace('powercord', 'vizality');
  return originalModuleLoad(request, parent, isMain);
};

// CSS Injection
function init () {
  document.documentElement.setAttribute('vizality', '');
  const StyleManager = require('../Vizality/managers/styles');
  global.sm = new StyleManager();
  global.sm.loadThemes();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
