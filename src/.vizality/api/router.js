const { logger: { error } } = require('@util');
const { getModule } = require('@webpack');
const { API } = require('@entities');

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
     * if (oldRoute && this.routes.find(c => c.path === oldRoute.split('/_vizality')[1])) {
     *   const router = getModule('replaceWith');
     *   router.replaceWith(oldRoute);
     * }
     * return DiscordNative.settings.set('_VIZALITY_ROUTE', void 0);
     */
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

  go (path) {
    try {
      const { popAllLayers } = getModule('popLayer');
      const { popAll } = getModule('popAll', 'push', 'update', 'pop', 'popWithKey');
      const { transitionTo } = getModule('transitionTo');
      // Pop all layers
      popAllLayers();
      // Pop all modals
      popAll();
      // Go to route
      transitionTo(`/_vizality${path}`);
    } catch (err) {
      return error(_module, `${_submodule}:go`, null, err);
    }
  }
};
