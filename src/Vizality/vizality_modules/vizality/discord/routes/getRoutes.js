const { logger: { log } } = require('vizality/util');

const _getRoutes = require('./_getRoutes');

const getRoutes = () => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:routes:getRoutes';

  const routeList = Object.keys(_getRoutes()).filter(r => r !== 'guild');

  log(MODULE, SUBMODULE, null, `List of routes to be used with 'Discord.routes.goTo':`, routeList);

  return routeList;
};

module.exports = getRoutes;
