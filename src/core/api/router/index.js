const { logger: { error } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { API } = require('@vizality/entities');

const Sidebar = require('@vizality/builtins/dashboard/components/parts/sidebar/Sidebar');
const Routes = require('@vizality/builtins/dashboard/routes/Routes');

const _module = 'API';
const _submodule = 'Router';

/**
 * @typedef VizalityRoute
 * @property {string} path Route path
 * @property {React.Component|function(): React.ReactNode} render Route renderer
 * @property {React.Component|function(): React.ReactNode|undefined} sidebar Sidebar renderer
 */

/**
 * Vizality custom router API
 * @property {VizalityRoute[]} routes Registered routes
 */
module.exports = class RouterAPI extends API {
  constructor () {
    super();
    this.routes = [];
  }

  /**
   * Restores previous navigation if necessary
   * @returns {void}
   */
  async restorePrevious () {
    return null;
    /*
     * const oldRoute = await DiscordNative.settings.get('_VIZALITY_ROUTE');
     * if (oldRoute && this.routes.find(c => c.path === oldRoute.split('/vizality')[1])) {
     *   const router = getModule('replaceWith');
     *   router.replaceWith(oldRoute);
     * }
     * return DiscordNative.settings.set('_VIZALITY_ROUTE', void 0);
     */
  }

  /**
   * This is a hacky method used to unregister and reregister the main dashboard route
   * so that it doesn't override the plugin and theme routes... Not really sure how to do
   * this in a better way at the moment, but definitely should be addressed in the future.
   */
  /** @private */
  _reregisterDashboard () {
    if (!this.routes.find(r => r.path === '/dashboard')) return;
    this.unregisterRoute('/dashboard');
    this.registerRoute({
      path: '/dashboard',
      render: Routes,
      sidebar: Sidebar
    });
  }

  /**
   * Registers a route
   * @param {VizalityRoute} route Route to register
   * @emits RouterAPI#routeAdded
   * @returns {void}
   */
  registerRoute (route) {
    try {
      if (this.routes.find(r => r.path === route.path)) {
        throw new Error(`Route "${route.path}" is already registered!`);
      }
      this.routes.push(route);
      if (this.routes[this.routes.length - 1].path !== '/dashboard') {
        this._reregisterDashboard();
      }
      this.emit('routeAdded', route);
    } catch (err) {
      return error(_module, `${_submodule}:registerRoute`, null, err);
    }
  }

  /**
   * Unregisters a route
   * @param {string} path Route path to unregister
   * @emits RouterAPI#routeRemoved
   * @returns {void}
   */
  unregisterRoute (path) {
    try {
      if (this.routes.find(r => r.path === path)) {
        this.routes = this.routes.filter(r => r.path !== path);
        this.emit('routeRemoved', name);
      } else {
        throw new Error(`Route "${path}" is not registered, so it cannot be unregistered!`);
      }
    } catch (err) {
      return error(_module, `${_submodule}:unregisterRoute`, null, err);
    }
  }

  navigate (path) {
    try {
      const { popAllLayers } = getModule('popLayer');
      const { popAll } = getModule('popAll', 'push', 'update', 'pop', 'popWithKey');
      const { transitionTo } = getModule('transitionTo');
      // Pop all layers
      popAllLayers();
      // Pop all modals
      popAll();
      // Go to route
      transitionTo(`/vizality${path}`);
    } catch (err) {
      return error(_module, `${_submodule}:navigate`, null, err);
    }
  }
};
