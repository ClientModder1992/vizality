const Routes = require('../module/routes');

// With how this is set up, always go from specific to more generic
const _getRoutes = () => {
  const routes = {
    private: '/channels/@me/',
    discover: Routes.GUILD_DISCOVERY,
    friends: Routes.FRIENDS,
    library: Routes.APPLICATION_LIBRARY,
    nitro: Routes.APPLICATION_STORE,
    guild: '/channels/',
    settings: '/vizality/dashboard/settings',
    plugins: '/vizality/dashboard/plugins',
    themes: '/vizality/dashboard/themes',
    snippets: '/vizality/dashboard/snippets',
    'quick-code': '/vizality/dashboard/quick-code',
    developers: '/vizality/dashboard/developers',
    docs: '/vizality/dashboard/documentation',
    updater: '/vizality/dashboard/updater',
    changelog: '/vizality/dashboard/changelog',
    dashboard: '/vizality/dashboard'
  };

  return routes;
};

module.exports = _getRoutes;
