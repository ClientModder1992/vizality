const Routes = require('../modules/routes');

const _getRoutes = () => {
  const routes = {
    discover: Routes.GUILD_DISCOVERY,
    // channel: '//channels/[0-9]+/.*/',
    dm: '/channels/@me/',
    friends: Routes.FRIENDS,
    guild: '/channels/',
    library: Routes.APPLICATION_LIBRARY,
    nitro: Routes.APPLICATION_STORE
  };

  return routes;
};

module.exports = _getRoutes;
