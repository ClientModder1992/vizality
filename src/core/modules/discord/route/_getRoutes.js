const Routes = require('../module/routes');

// With how this is set up, always go from specific to more generic
const _getRoutes = () => {
  const routes = {
    discover: Routes.GUILD_DISCOVERY,
    // channel: '//channels/[0-9]+/.*/',
    dm: '/channels/@me/',
    friends: Routes.FRIENDS,
    guild: '/channels/',
    library: Routes.APPLICATION_LIBRARY,
    nitro: Routes.APPLICATION_STORE,
    'vz-installed-plugins': '/vizality/dashboard/plugins/installed',
    'vz-discover-plugins': '/vizality/dashboard/plugins/discover',
    'vz-plugins': '/vizality/dashboard/plugins',
    'vz-installed-themes': '/vizality/dashboard/themes/installed',
    'vz-discover-themes': '/vizality/dashboard/themes/discover',
    'vz-themes': '/vizality/dashboard/themes',
    'vz-updater': '/vizality/dashboard/updater',
    'vz-dashboard': '/vizality/dashboard'
  };

  return routes;
};

module.exports = _getRoutes;
