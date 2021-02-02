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
    settings: '/vizality/settings',
    plugins: '/vizality/plugins',
    themes: '/vizality/themes',
    snippets: '/vizality/snippets',
    'quick-code': '/vizality/quick-code',
    developers: '/vizality/developers',
    docs: '/vizality/docs',
    updater: '/vizality/updater',
    changelog: '/vizality/changelog',
    dashboard: '/vizality'
  };

  return routes;
};

module.exports = _getRoutes;
