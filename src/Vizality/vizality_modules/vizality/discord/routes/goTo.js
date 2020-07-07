const { Routes, getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const _getRoutes = require('./_getRoutes');

const goTo = (location) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:routes:goTo';

  const routeList = Object.keys(_getRoutes()).filter(r => r !== 'guild');

  if (!location) {
    return warn(MODULE, SUBMODULE, null, `You must enter a valid route string. List of available routes:`, routeList);
  }

  const router = getModule('transitionTo');

  if (Object.keys(Routes).includes(location)) {
    return router.transitionTo(Routes[location]);
  }

  if (Object.values(Routes).includes(location)) {
    return router.transitionTo(location);
  }

  location = location.toLowerCase();

  switch (location) {
    case 'discover':
      return router.transitionTo(Routes.GUILD_DISCOVERY);
    case 'dm':
      return router.transitionTo(Routes.CHANNEL('@me', getModule('getPrivateChannelIds').getPrivateChannelIds()[0]));
    case 'friends':
      return router.transitionTo(Routes.FRIENDS);
    case 'library':
      return router.transitionTo(Routes.APPLICATION_LIBRARY);
    case 'nitro':
      return router.transitionTo(Routes.APPLICATION_STORE);
    default:
      return warn(MODULE, SUBMODULE, null, `The route '${location}' was not found. List of available routes:`, routeList);
  }
};

module.exports = goTo;
