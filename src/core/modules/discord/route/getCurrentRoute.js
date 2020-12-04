const _getRoutes = require('./_getRoutes');

module.exports = () => {
  const routes = _getRoutes();
  /* const historyRoute = currentWebContents.history[currentWebContents.history.length - 2]; */

  for (const location in routes) {
    if (window.location.href.includes(routes[location])) {
      return location;
    }
  }

  return 'unknown';
};
