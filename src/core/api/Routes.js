import { getCaller } from '@vizality/util/file';
import { Regexes } from '@vizality/constants';
import { getModule } from '@vizality/webpack';
import { API } from '@vizality/entities';

import DashboardSidebar from '@vizality/builtins/dashboard/components/parts/sidebar/Sidebar';
import DashboardRoutes from '@vizality/builtins/dashboard/routes/Routes';

/**
 * @typedef VizalityRoute
 * @property {string} id Route ID
 * @property {string} path Route path
 * @property {React.Component|function(): React.ReactNode} render Route renderer
 * @property {React.Component|function(): React.ReactNode|undefined} sidebar Sidebar renderer
 */

export default class Routes extends API {
  constructor () {
    super();
    this.routes = {};
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
  async restorePreviousRoute () {
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
      if (!route?.id) {
        throw new Error('Route must contain a valid ID!');
      }
      if (route.id !== 'home') {
        if (!route.path) {
          throw new Error(`Route ID "${route.id}" cannot be registered without a valid path.`);
        }
        if (this.routes[route.id]) {
          throw new Error(`Route ID "${route.id}" is already registered!`);
        }
        if (Object.values(this.routes).find(r => r.path === route.path)) {
          throw new Error(`Route ID "${route.id}" tried to register an already-registered path "${route.path}"!`);
        }
        route.caller = getCaller();
      }
      this.routes[route.id] = route;
      if (Object.keys(this.routes)[Object.keys(this.routes).length - 1] !== 'home') {
        this._reregisterDashboardRoutes();
      }
      this.emit('routeAdd', route);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters a route.
   * @param {string} pathOrRouteId Route path or route ID
   * @emits Routes#routeRemove
   */
  unregisterRoute (pathOrRouteId) {
    try {
      if (!pathOrRouteId) {
        throw new Error(`Invalid route path or route ID provided!`);
      }
      if (pathOrRouteId.startsWith('/')) {
        if (!Object.values(this.routes).find(r => r.path === pathOrRouteId)) {
          throw new Error(`Route path "${pathOrRouteId}" is not registered, so it cannot be unregistered!`);
        }
      } else if (!this.routes[pathOrRouteId]) {
        throw new Error(`Route ID "${pathOrRouteId}" is not registered, so it cannot be unregistered!`);
      }
      // const routeId = (Object.values(this.routes).find(r => r.id === pathOrRouteId || r.path === pathOrRouteId)).id;
      this.routes =
      Object.fromEntries(
        Object.entries(this.routes)
          .filter(r => r[1].id !== pathOrRouteId && r[1].path !== pathOrRouteId)
      );
      this.emit('routeRemove', pathOrRouteId);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Navigates to a route.
   * @param {string} pathOrRouteId Route path or route ID
   * @emits Routes#routeNavigate
   */
  navigateTo (pathOrRouteId) {
    try {
      const { popAll } = getModule('popAll', 'push', 'update', 'pop', 'popWithKey');
      const { transitionTo } = getModule('transitionTo');
      const { useModalsStore } = getModule('openModal');
      const { popAllLayers } = getModule('popLayer');
      popAllLayers(); // Pop all layers
      popAll(); // Pop all modals
      useModalsStore.setState(() => ({ default: [] })); // Pop all new version modals

      if (!pathOrRouteId) throw new Error('Invalid route ID or path provided!');

      let path;
      if (!pathOrRouteId.startsWith('/')) {
        const { Routes } = getModule('Routes');
        switch (pathOrRouteId) {
          case 'private': path = '/channels/@me/'; break;
          case 'discover': path = Routes.GUILD_DISCOVERY; break;
          case 'friends': path = Routes.FRIENDS; break;
          case 'library': path = Routes.APPLICATION_LIBRARY; break;
          case 'nitro': path = Routes.APPLICATION_STORE; break;
          default: path = `/vizality/${pathOrRouteId}`;
        }
      } else {
        path = pathOrRouteId;
      }

      // Go to route
      transitionTo(path);
      this.emit('routeNavigate', path);
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters all routes.
   * @emits Routes#routeRemoveAll
   */
  unregisterAllRoutes () {
    try {
      this.routes = {};
      this.emit('routeRemoveAll');
    } catch (err) {
      return this.error(err);
    }
  }

  /**
   * Unregisters all routes registered by a given addon.
   * @param {string} addonId Addon ID
   * @emits Routes#routeRemoveAllByAddon
   */
  unregisterRoutesByAddon (addonId) {
    try {
      this.emit('routeRemoveAllByAddon', addonId);
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
   * Gets some information for the current route.
   */
  getCurrentRoute () {
    try {
      const { Routes } = getModule('Routes');
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
      if (!this.routes.home) return;
      this.unregisterRoute('home');
      this.registerRoute({
        id: 'home',
        path: '',
        render: DashboardRoutes,
        sidebar: DashboardSidebar
      });
    } catch (err) {
      return this.error(err);
    }
  }
}
