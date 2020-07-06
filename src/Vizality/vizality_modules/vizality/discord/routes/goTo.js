const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

const _getRoutes = require('./_getRoutes');

const goTo = (location) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:routes:goTo';

  const routeList = Object.keys(_getRoutes()).filter(r => r !== 'guild');

  if (!location) {
    return warn(MODULE, SUBMODULE, null, `You must enter a valid route string. List of available routes:`, routeList);
  }

  const DISCORD_ROUTES = getModule([ 'Routes' ]).Routes;

  if (Object.keys(DISCORD_ROUTES).includes(location)) {
    return getModule([ 'transitionTo' ]).transitionTo(DISCORD_ROUTES[location]);
  }

  if (Object.values(DISCORD_ROUTES).includes(location)) {
    return getModule([ 'transitionTo' ]).transitionTo(location);
  }

  location = location.toLowerCase();

  switch (location) {
    case 'discover':
      return getModule([ 'transitionTo' ]).transitionTo(DISCORD_ROUTES.GUILD_DISCOVERY);
    case 'dm':
      return getModule([ 'transitionTo' ]).transitionTo(
        DISCORD_ROUTES.CHANNEL('@me', getModule([ 'getPrivateChannelIds' ]).getPrivateChannelIds()[0])
      );
    case 'friends':
      return getModule([ 'transitionTo' ]).transitionTo(DISCORD_ROUTES.FRIENDS);
    case 'library':
      return getModule([ 'transitionTo' ]).transitionTo(DISCORD_ROUTES.APPLICATION_LIBRARY);
    case 'nitro':
      return getModule([ 'transitionTo' ]).transitionTo(DISCORD_ROUTES.APPLICATION_STORE);
    default:
      return warn(MODULE, SUBMODULE, null, `The route '${location}' was not found. List of available routes:`, routeList);
  }
};

module.exports = goTo;
