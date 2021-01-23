import { Regexes } from '@vizality/constants';
import { getModule } from '@vizality/webpack';
import { API } from '@vizality/entities';

import DashboardSidebar from '@vizality/builtins/vz-dashboard/components/parts/sidebar/Sidebar';
import DashboardRoutes from '@vizality/builtins/vz-dashboard/routes/Routes';

/**
 * @typedef VizalityRoute
 * @property {string} path Route path
 * @property {React.Component|function(): React.ReactNode} render Route renderer
 * @property {React.Component|function(): React.ReactNode|undefined} sidebar Sidebar renderer
 */

/**
 * Vizality custom routes API
 * @property {VizalityRoute[]} routes Registered routes
 */
export default class Routes extends API {
  constructor () {
    super();
    this.routes = [];
    this._module = 'API';
    this._submodule = 'Routes';
  }

  /**
   * Restores previous navigation,
   * @returns {void}
   */
  async restorePrevious () {
    try {
      if (window.location.pathname.startsWith('/vizality')) {
        const router = getModule('replaceWith');
        let history = await vizality.native.app.getHistory();
        history = history.reverse();
        history.shift();
        const match = history.find(location => !location.includes('/vizality'));
        const route = match.replace(new RegExp(Regexes.DISCORD), '');
        router.replaceWith(route);
        // this.navigate(route);
      }
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * @note This is a hacky method used to unregister and reregister the main dashboard route
   * so that it doesn't override the plugin and theme routes... Not really sure how to do
   * this in a better way at the moment, but definitely should be addressed in the future.
   * @private
   */
  _reregisterDashboard () {
    if (!this.routes.find(r => r.path === '/dashboard')) return;

    this.unregisterRoute('/dashboard');
    this.registerRoute({
      path: '/dashboard',
      render: DashboardRoutes,
      sidebar: DashboardSidebar
    });
  }

  /**
   * Registers a route
   * @param {VizalityRoute} route Route to register
   * @emits Routes#routeAdded
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
      return this.error(err);
    }
  }

  /**
   * Unregisters a route
   * @param {string} path Route path to unregister
   * @emits Routes#routeRemoved
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
      return this.error(err);
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
      if (!path.startsWith('/')) {
        const { Routes } = getModule('Routes');

        switch (path) {
          case 'private': path = '/channels/@me/'; break;
          case 'discover': path = Routes.GUILD_DISCOVERY; break;
          case 'friends': path = Routes.FRIENDS; break;
          case 'library': path = Routes.APPLICATION_LIBRARY; break;
          case 'nitro': path = Routes.APPLICATION_STORE; break;

          case 'dashboard': path = '/vizality/dashboard'; break;
          case 'settings': path = '/vizality/dashboard/settings'; break;
          case 'plugins': path = '/vizality/dashboard/plugins'; break;
          case 'themes': path = '/vizality/dashboard/themes'; break;
          case 'snippets': path = '/vizality/dashboard/snippets'; break;
          case 'quick-code': path = '/vizality/dashboard/quick-code'; break;
          case 'developers': path = '/vizality/dashboard/developers'; break;
          case 'documentation': path = '/vizality/dashboard/documentation'; break;
          case 'updater': path = '/vizality/dashboard/updater'; break;
          case 'changelog': path = '/vizality/dashboard/changelog'; break;
          default: path = '/channels/@me';
        }
      }

      transitionTo(path);
    } catch (err) {
      return this.error(err);
    }
  }

  stop () {
    delete vizality.api.routes;
    this.removeAllListeners();
  }
}
