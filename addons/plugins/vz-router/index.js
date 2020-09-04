const { react : { findInReactTree, findInTree, getOwnerInstance }, dom: { waitForElement } } = require('@utilities');
const { getModule, getModules, getModuleByDisplayName } = require('@webpack');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');
const { React } = require('@react');

module.exports = class Router extends Plugin {
  async onStart () {
    await this.injectRouter();
    await this.injectViews();
    await this.injectSidebar();
    this.forceRouterUpdate();
    vizality.api.router.on('routeAdded', this.forceRouterUpdate);
    vizality.api.router.on('routeRemoved', this.forceRouterUpdate);
  }

  onStop () {
    vizality.api.router.off('routeAdded', this.forceRouterUpdate);
    vizality.api.router.off('routeRemoved', this.forceRouterUpdate);
    unpatch('vz-router-routes');
    unpatch('vz-router-views');
    unpatch('vz-router-sidebar');
    this.forceRouterUpdate();
  }

  async injectRouter () {
    const { container } = await getModule('container', 'downloadProgressCircle', true);
    const RouteRenderer = getOwnerInstance(await waitForElement(`.${container.split(' ')[0]}`));
    patch('vz-router-routes', RouteRenderer.__proto__, 'render', (_, res) => {
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
  }

  async injectViews () {
    const FluxifiedViews = await getModuleByDisplayName('FluxContainer(ViewsWithMainInterface)', true);
    const Views = FluxifiedViews.prototype.render.call({ memoizedGetStateFromStores: () => ({}) }).type;

    patch('vz-router-views', Views.prototype, 'render', (args, res) => {
      const routes = findInTree(res, n => Array.isArray(n) && n[0] && n[0].key && n[0].props.path && n[0].props.render);

      routes[routes.length - 1].props.path = [
        ...new Set(routes[routes.length - 1].props.path.concat(vizality.api.router.routes.map(route => `/_vizality${route.path}`)))
      ];
      return res;
    });
  }

  async injectSidebar () {
    const { panels } = await getModule('panels', true);
    const instance = getOwnerInstance(await waitForElement(`.${panels}`));

    patch('vz-router-sidebar', instance._reactInternalFiber.type.prototype, 'render', (_, res) => {
      const renderer = res.props.children;

      res.props.children = (props) => {
        const rendered = renderer(props);
        const className = rendered && rendered.props && rendered.props.children && rendered.props.children.props && rendered.props.children.props.className;
        if (className && className.startsWith('sidebar-') && rendered.props.value.location.pathname.startsWith('/_vizality')) {
          const rawPath = rendered.props.value.location.pathname.substring('_vizality'.length + 1);
          const route = vizality.api.router.routes.find(rte => rawPath.startsWith(rte.path));
          if (route && route.sidebar) {
            rendered.props.children.props.children[0] = React.createElement(route.sidebar);
          } else {
            rendered.props.children = null;
          }
        }
        return rendered;
      };
      return res;
    });
  }

  async forceRouterUpdate () {
    // Views
    const { app } = getModules([ 'app' ]).find(m => Object.keys(m).length === 1);
    const viewsInstance = getOwnerInstance(await waitForElement(`.${app}`));
    findInTree(viewsInstance._reactInternalFiber, n => n && n.historyUnlisten, { walkable: [ 'child', 'stateNode' ] }).forceUpdate();

    // Routes
    const { container } = await getModule('container', 'downloadProgressCircle', true);
    const routesInstance = getOwnerInstance(await waitForElement(`.${container}`));
    routesInstance.forceUpdate();
  }
};
