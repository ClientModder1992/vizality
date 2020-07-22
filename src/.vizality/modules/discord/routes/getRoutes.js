const { logger: { log } } = require('@util');

const _getRoutes = require('./_getRoutes');

const getRoutes = () => {
  const module = 'Module';
  const submodule = 'Discord:routes:getRoutes';

  const routeList = Object.keys(_getRoutes()).filter(r => r !== 'guild');

  log(module, submodule, null, `List of routes to be used with 'Discord.routes.goTo':`, routeList);

  return routeList;
};

module.exports = getRoutes;
