const { constants: { Routes } } = require('@webpack');

const _getRoutes = () => {
  const ROUTES = {
    discover: Routes.GUILD_DISCOVERY,
    // channel: '//channels/[0-9]+/.*/',
    dm: '/channels/@me/',
    friends: Routes.FRIENDS,
    guild: '/channels/',
    library: Routes.APPLICATION_LIBRARY,
    nitro: Routes.APPLICATION_STORE
  };

  return ROUTES;
};

module.exports = _getRoutes;
