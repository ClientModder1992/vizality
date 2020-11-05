const { logger: { log } } = require('@vizality/util');

const _getRoutes = require('./_getRoutes');

const getRoutes = () => {
  const module = 'Module';
  const submodule = 'Discord:Route:getRoutes';

  const routes = Object.keys(_getRoutes()).filter(r => r !== 'guild');

  log(module, submodule, null, `List of routes to be used with 'Discord:Route:goTo':`, routes);

  return routes;
};

module.exports = getRoutes;
