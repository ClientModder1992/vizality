const { getModule } = require('vizality/webpack');

const _getRoutes = () => {
  const DISCORD_ROUTES = getModule([ 'Routes' ]).Routes;
  const ROUTES = {
    discover: DISCORD_ROUTES.GUILD_DISCOVERY,
    // channel: '//channels/[0-9]+/.*/',
    dm: '/channels/@me/',
    friends: DISCORD_ROUTES.FRIENDS,
    guild: '/channels/',
    library: DISCORD_ROUTES.APPLICATION_LIBRARY,
    nitro: DISCORD_ROUTES.APPLICATION_STORE
  };

  return ROUTES;
};

module.exports = _getRoutes;
