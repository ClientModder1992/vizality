const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { React, getModule, getAllModules, getModuleByDisplayName } = require('vizality/webpack');
const { react : { findInReactTree, findInTree, getOwnerInstance }, waitFor } = require('vizality/util');

module.exports = class Router extends Plugin {
  async startPlugin () {
    await this._injectRouter();
    this._listener = this._rerender.bind(this);
    vizality.api.router.on('routeAdded', this._listener);
    vizality.api.router.on('routeRemoved', this._listener);
    setImmediate(() => vizality.api.router.restorePrevious());
  }

  pluginWillUnload () {
    vizality.api.router.off('routeAdded', this._listener);
    vizality.api.router.off('routeRemoved', this._listener);
    uninject('vz-router-route-side');
    uninject('vz-router-route');
    uninject('vz-router-router');
  }

  async _injectRouter () {
    const FluxViewsWithMainInterface = await getModuleByDisplayName('FluxContainer(ViewsWithMainInterface)', true);
    const ViewsWithMainInterface = FluxViewsWithMainInterface
      .prototype.render.call({ memoizedGetStateFromStores: () => ({}) }).type;
    const { container } = await getModule([ 'container', 'downloadProgressCircle' ], true);
    const RouteRenderer = getOwnerInstance(await waitFor(`.${container.split(' ')[0]}`));
    inject('vz-router-route', RouteRenderer.__proto__, 'render', (args, res) => {
      const { children: routes } = findInReactTree(res, m => Array.isArray(m.children) && m.children.length > 5);
      routes.push(
        ...vizality.api.router.routes.map(route => ({
          ...routes[0],
          props: {
            // @todo: Error boundary (?)
            render: () => React.createElement(route.render),
            path: `/_vizality${route.path}`
          }
        }))
      );
      return res;
    });

    inject('vz-router-route-side', RouteRenderer.__proto__, 'render', function (args) {
      const renderer = this.renderChannelSidebar;
      this.renderChannelSidebar = (props) => {
        const rte = vizality.api.router.routes.find(r => r.path === props.location.pathname.slice(11));
        if (rte && rte.noSidebar) {
          return null;
        }
        return renderer.call(this, props);
      };
      return args;
    }, true);

    inject('vz-router-router', ViewsWithMainInterface.prototype, 'render', (args, res) => {
      const routes = findInTree(res, n => (
        Array.isArray(n) && n[0] &&
        n[0].key &&
        n[0].props.path && n[0].props.render
      ));

      routes[routes.length - 1].props.path = [
        ...new Set(routes[routes.length - 1].props.path.concat(vizality.api.router.routes.map(route => `/_vizality${route.path}`)))
      ];
      return res;
    });

    RouteRenderer.forceUpdate();
    this._rerender();
  }

  async _rerender () {
    const { app } = getAllModules([ 'app' ]).find(m => Object.keys(m).length === 1);
    const instance = getOwnerInstance(await waitFor(`.${app.split(' ')[0]}`));
    findInTree(instance._reactInternalFiber, n => n && n.historyUnlisten, { walkable: [ 'child', 'stateNode' ] }).forceUpdate();
  }
};
