const _getRoutes = require('./_getRoutes');

const getCurrentRoute = () => {
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

  return 'unknown';
};

module.exports = getCurrentRoute;
