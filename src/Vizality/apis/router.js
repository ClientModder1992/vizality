const { API } = require('vizality/entities');
const { getModule } = require('vizality/webpack');

/**
 * @typedef VizalityRoute
 * @property {String} path Route path
 * @property {Boolean} noSidebar Whether the sidebar should be removed or not
 * @property {function(): React.ReactNode} render Route renderer
 */

/**
 * @typedef VizalityDeeplink
 */

/**
 * Vizality custom router API
 * @property {VizalityRoute[]} routes Registered routes
 */
class RouterAPI extends API {
  constructor () {
    super();

    this.routes = [];
  }

  /**
   * Restores previous navigation if necessary
   */
  async restorePrevious () {
    const oldRoute = DiscordNative.globals.appSettings.get('_VIZALITY_ROUTE');
    if (oldRoute && this.routes.find(c => c.path === oldRoute.split('/_vizality')[1])) {
      const router = await getModule([ 'replaceWith' ]);
      router.replaceWith(oldRoute);
    }
    DiscordNative.globals.appSettings.set('_VIZALITY_ROUTE', void 0);
    DiscordNative.globals.appSettings.save();
  }

  /**
   * Registers a route
   * @param {VizalityRoute} route Route to register
   * @emits RouterAPI#routeAdded
   */
  registerRoute (route) {
    if (this.routes.find(r => r.path === route.path)) {
      throw new Error(`Route ${route.path} is already registered!`);
    }
    this.routes.push(route);
    this.emit('routeAdded', route);
  }

  /**
   * Unregisters a route
   * @param {String} path Route to unregister
   * @emits RouterAPI#routeRemoved
   */
  unregisterRoute (path) {
    if (this.routes.find(r => r.path === path)) {
      this.routes = this.routes.filter(r => r.path !== path);
      this.emit('routeRemoved', path);
    }
  }
}

module.exports = RouterAPI;
