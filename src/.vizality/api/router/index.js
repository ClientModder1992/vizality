const Entities = require('@entities');
const Webpack = require('@webpack');
const Util = require('@util');

/**
 * @typedef VizalityRoute
 * @property {String} path Route path
 * @property {Boolean} noSidebar Whether the sidebar should be removed or not
 * @property {function(): React.ReactNode} render Route renderer
 */

/**
 * Vizality custom router API
 * @property {VizalityRoute[]} routes Registered routes
 */
module.exports = class RouterAPI extends Entities.API {
  constructor () {
    super();
    this.routes = [];
    this.shortcuts = {};
  }

  /**
   * Restores previous navigation if necessary
   */
  async restorePrevious () {
    const oldRoute = await DiscordNative.settings.get('_VIZALITY_ROUTE');
    if (oldRoute && this.routes.find(c => c.path === oldRoute.split('/_vizality')[1])) {
      const router = Webpack.getModule('replaceWith');
      router.replaceWith(oldRoute);
    }
    return DiscordNative.settings.set('_VIZALITY_ROUTE', void 0);
  }

  /**
   * Registers a route
   * @param {VizalityRoute} route Route to register
   * @emits RouterAPI#routeAdded
   */
  registerRoute (route) {
    if (this.routes.find(r => r.path === route.path)) {
      return Util.Logger.error(this._module, this._submodule, null, `Route '${route.path}' is already registered!`);
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
    } else {
      return Util.Logger.warn(this._module, this._submodule, null, `Route "${path}" is not registered, so it cannot be unregistered.`);
    }
  }

  /**
   * Registers a "shotcut" action
   * @param {String} name Name of the shortcut
   * @param {Function} action Function to run
   * @emits RouterAPI#shortcutAdded
   */
  registerShortcut (name, action) {
    if (Object.keys(this.shortcuts).find(r => r === name)) {
      return Util.Logger.error(this._module, this._submodule, null, `Shortcut "${name}" is already registered!`);
    }

    if (typeof action !== 'function') {
      return Util.Logger.error(this._module, this._submodule, null, `Argument "action" must be a function.`);
    }

    Object.keys(this.shortcuts).push(name);
    this.shortcuts[name] = () => action();

    this.emit('shortcutAdded', name);
  }

  /**
   * Unregisters a "shotcut" action
   * @param {String} name Name of the shortcut
   * @emits RouterAPI#shortcutRemoved
   */
  unregisterShortcut (name) {
    if (Object.keys(this.shortcuts).find(r => r === name)) {
      this.shortcuts = Object.keys(this.shortcuts).filter(r => r !== name);

      this.emit('shortcutRemoved', name);
    } else {
      return Util.Logger.warn(this._module, this._submodule, null, `Shortcut '${name}' is not registered, so it cannot be unregistered!`);
    }
  }

  /**
   * Performs a "shortcut" action
   * @param {String} name Name of the shortcut
   */
  open (name) {
    this.shortcuts[name]();
  }


};
