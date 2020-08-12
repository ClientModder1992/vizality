const { constants: { Routes }, getModule } = require('@webpack');
const { logger: { warn } } = require('@utilities');

const _getRoutes = require('./_getRoutes');

const goTo = (location) => {
  const module = 'Module';
  const submodule = 'Discord:routes:goTo';

  const routeList = Object.keys(_getRoutes()).filter(r => r !== 'guild');

  if (!location) {
    return warn(module, submodule, null, `You must enter a valid route string. List of available routes:`, routeList);
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
      return warn(module, submodule, null, `The route '${location}' was not found. List of available routes:`, routeList);
  }
};

module.exports = goTo;
