import { assertString } from '@vizality/util/string';
import { getCaller } from '@vizality/util/file';
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

  stop () {
    delete vizality.api.routes;
    this.removeAllListeners();
  }

  /**
   * Goes back to the last non-Vizality route.
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
      }
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Registers a route.
   * @param {VizalityRoute} route Route to register
   * @emits Routes#routeAdd
   */
  registerRoute (route) {
    try {
      if (this.routes.find(r => r.path === route.path)) {
        throw new Error(`Route "${route.path}" is already registered!`);
      }
      const caller = getCaller();
      if (!route.path && route.path !== '') {
        throw new Error(`Route "${route.path}" cannot be registered without a valid path.`);
      }
      route.caller = caller;
      this.routes.push(route);
      if (this.routes[this.routes.length - 1].path !== '') {
        this._reregisterDashboardRoutes();
      }
      this.emit('routeAdd', route);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters a route.
   * @param {string} path Route path to unregister
   * @emits Routes#routeRemove
   * @returns {void}
   */
  unregisterRoute (path) {
    try {
      if (this.routes.find(r => r.path === path)) {
        this.routes = this.routes.filter(r => r.path !== path);
        this.emit('routeRemove', path);
      } else {
        throw new Error(`Route "${path}" is not registered, so it cannot be unregistered!`);
      }
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Navigates to a route.
   * @param {string} path Route path to unregister
   * @emits Routes#routeNavigate
   */
  navigateTo (path) {
    try {
      const { popAllLayers } = getModule('popLayer');
      const { popAll } = getModule('popAll', 'push', 'update', 'pop', 'popWithKey');
      const { transitionTo } = getModule('transitionTo');

      // Pop all layers
      popAllLayers();
      // Pop all modals
      popAll();

      if (!path) {
        throw new Error(`You must provide a valid path argument!`);
      }

      if (!path.startsWith('/')) {
        const { Routes } = getModule('Routes');
        const discordRoutes = [ 'private', 'discover', 'friends', 'library', 'nitro' ];
        if (discordRoutes.includes(path)) {
          switch (path) {
            case 'private': path = '/channels/@me/'; break;
            case 'discover': path = Routes.GUILD_DISCOVERY; break;
            case 'friends': path = Routes.FRIENDS; break;
            case 'library': path = Routes.APPLICATION_LIBRARY; break;
            case 'nitro': path = Routes.APPLICATION_STORE; break;
          }
        } else {
          path = `/vizality/${path}`;
        }
      }

      // Go to route
      transitionTo(path);
      this.emit('routeNavigate', path);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters all routes if no argument is provided. Otherwise, unregisters all routes
   * for the specified addon.
   * @param {string} [addonId] Addon ID
   * @emits Routes#routeRemoveAll
   */
  unregisterAllRoutes (addonId = '') {
    try {
      assertString(addonId);
      if (addonId === '') {
        this.routes = [];
      } else {
        this.removeRoute(addonId);
      }
      /*
       * Only emit the event if addonId not supplied,
       * otherwise, emit the addonId as well
       */
      this.emit('routeRemoveAll', addonId || null);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Goes forward to the next route. Only works when you have previously went back.
   */
  goForward () {
    try {
      const router = getModule('transitionTo', 'replaceWith', 'getHistory');
      router.back();
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Goes back to the previous route.
   */
  goBack () {
    try {
      const router = getModule('transitionTo', 'replaceWith', 'getHistory');
      router.forward();
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets all of the currently registered routes.
   */
  getRoutes () {
    try {
      return this.routes;
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Gets some information for the current route.
   */
  getCurrentRoute () {
    try {
      const location = {};
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

      for (const route in routes) {
        if (window.location.pathname.includes(routes[route])) {
          location.pathname = window.location.pathname;
          location.href = window.location.href;
          location.name = route || 'unknown';
          return location;
        }
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
  _reregisterDashboardRoutes () {
    try {
      if (!this.routes.find(r => r.path === '')) return;

      this.unregisterRoute('');
      this.registerRoute({
        path: '',
        render: DashboardRoutes,
        sidebar: DashboardSidebar
      });
    } catch (err) {
      return this.error(err);
    }
  }
}
