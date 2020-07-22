const { logger: { warn } } = require('@util');
/* const currentWebContents = require('electron').remote.getCurrentWebContents(); */

const _getRoutes = require('./_getRoutes');

const getCurrentRoute = () => {
  const module = 'Module';
  const submodule = 'Discord:routes:getCurrentRoute';

  const routes = _getRoutes();
  /* const historyRoute = currentWebContents.history[currentWebContents.history.length - 2]; */

  for (const location in routes) {
    if (window.location.href.includes(routes[location])) {
      let locationStr = window.location.href.split('/');
      locationStr = `/${locationStr[3]}/${locationStr[4]}/`;
      /*
       * if (location === 'guild' && historyRoute.includes(locationStr)) {
       *   location = 'channel';
       * }
       */
      return location;
    }
  }

  warn(module, submodule, null, `The current route is unknown.`);

  return 'unknown';
};

module.exports = getCurrentRoute;
