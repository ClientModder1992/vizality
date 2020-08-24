const { Util, Webpack, Patcher, Entities: { Plugin } } = require('@modules');

module.exports = class Router extends Plugin {
  async onStart () {
    await this._injectRouter();
    this._listener = this._rerender.bind(this);
    vizality.api.router.on('routeAdded', this._listener);
    vizality.api.router.on('routeRemoved', this._listener);
    setImmediate(() => vizality.api.router.restorePrevious());
  }

  onStop () {
    vizality.api.router.off('routeAdded', this._listener);
    vizality.api.router.off('routeRemoved', this._listener);
    Patcher.unpatch('vz-router-route-side');
    Patcher.unpatch('vz-router-route');
    Patcher.unpatch('vz-router-router');
  }

  async _injectRouter () {
    const FluxViewsWithMainInterface = Webpack.getModuleByDisplayName('FluxContainer(ViewsWithMainInterface)');
    const ViewsWithMainInterface = FluxViewsWithMainInterface
      .prototype.render.call({ memoizedGetStateFromStores: () => ({}) }).type;
    const { container } = Webpack.getModule('container', 'downloadProgressCircle');
    const RouteRenderer = Webpack.getOwnerInstance(await Util.DOM.waitForElement(`.${container.split(' ')[0]}`));
    Patcher.patch('vz-router-route', RouteRenderer.__proto__, 'render', (_, res) => {
      const { children: routes } = Util.React.findInReactTree(res, m => Array.isArray(m.children) && m.children.length > 5);
      routes.push(
        ...vizality.api.router.routes.map(route => ({
          ...routes[0],
          props: {
            // @todo: Error boundary (?)
            render: () => Webpack.React.createElement(route.render),
            path: `/_vizality${route.path}`
          }
        }))
      );
      return res;
    });

    Patcher.patch('vz-router-route-side', RouteRenderer.__proto__, 'render', function (args) {
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

    Patcher.patch('vz-router-router', ViewsWithMainInterface.prototype, 'render', (_, res) => {
      const routes = Util.React.findInTree(res, n => (
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
    const { app } = Webpack.getModules([ 'app' ]).find(m => Object.keys(m).length === 1);
    const instance = Util.React.getOwnerInstance(await Util.DOM.waitForElement(`.${app.split(' ')[0]}`));
    Util.React.findInTree(instance._reactInternalFiber, n => n && n.historyUnlisten, { walkable: [ 'child', 'stateNode' ] }).forceUpdate();
  }
};
