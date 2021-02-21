import React, { useEffect } from 'react';

import { findInReactTree, findInTree, getOwnerInstance } from '@vizality/util/react';
import { getModule, getModules, getModuleByDisplayName } from '@vizality/webpack';
import { waitForElement } from '@vizality/util/dom';
import { patch, unpatch } from '@vizality/patcher';
import { useForceUpdate } from '@vizality/hooks';
import { Builtin } from '@vizality/entities';

export default class Router extends Builtin {
  async start () {
    await this.injectRouter();
    await this.injectViews();
    await this.injectSidebar();
    await this.forceRouterUpdate();
    vizality.api.routes.on('routeAdd', this.forceRouterUpdate);
    vizality.api.routes.on('routeRemove', this.forceRouterUpdate);
  }

  stop () {
    vizality.api.routes.off('routeAdd', this.forceRouterUpdate);
    vizality.api.routes.off('routeRemove', this.forceRouterUpdate);
    unpatch('vz-router-routes');
    unpatch('vz-router-views');
    unpatch('vz-router-sidebar');
    this.forceRouterUpdate();
  }

  async injectRouter () {
    const { container } = getModule('container', 'downloadProgressCircle');
    const RouteRenderer = getOwnerInstance(await waitForElement(`.${container}`));
    patch('vz-router-routes', RouteRenderer.props.children, 'type', (_, res) => {
      const { children } = findInReactTree(res, m => Array.isArray(m.children) && m.children.length > 5);
      children.push(
        ...Object.values(vizality.api.routes.routes).map(route => ({
          ...children[0],
          props: {
            render: () => {
              const Render = route.render;
              return <Render />;
            },
            path: `/vizality${route.path}`
          }
        }))
      );
      return res;
    });
  }

  async injectViews () {
    const FluxifiedViews = getModuleByDisplayName('FluxContainer(ViewsWithMainInterface)');
    const Views = FluxifiedViews.prototype.render.call({ memoizedGetStateFromStores: () => ({}) }).type;
    patch('vz-router-views', Views.prototype, 'render', (_, res) => {
      const routes = findInTree(res, n => Array.isArray(n) && n[0]?.key && n[0].props?.path && n[0].props.render);
      if (!Array.isArray(routes)) return res;
      routes[routes.length - 1].props.path = [
        ...new Set(routes[routes.length - 1].props.path.concat(Object.values(vizality.api.routes.routes).map(route => `/vizality${route.path}`)))
      ];
      return res;
    });
  }

  async injectSidebar () {
    const { panels } = getModule('panels');
    const instance = getOwnerInstance(await waitForElement(`.${panels}`));
    const Routes = getModule('handleRouteChange');
    patch('vz-router-sidebar', instance.props.children, 'type', (_, res) => {
      const forceUpdate = useForceUpdate();
      useEffect(() => {
        Routes.listeners.add(forceUpdate);
        return () => Routes.listeners.delete(forceUpdate);
      });

      const content = findInReactTree(res, n => n.props?.className?.startsWith('content-'));
      const className = content?.props?.children[0]?.props?.className;
      if (className && className.startsWith('sidebar-') && window.location.pathname.startsWith('/vizality')) {
        const rawPath = window.location.pathname.substring('vizality'.length + 1);
        const route = Object.values(vizality.api.routes.routes).find(rte => rawPath.startsWith(rte.path));
        if (route && route.sidebar) {
          const Sidebar = route.sidebar;
          content.props.children[0].props.children[0] = <Sidebar />;
        } else {
          content.props.children[0] = null;
        }
      }
      return res;
    });
  }

  async forceRouterUpdate () {
    // Views
    const { app } = getModules([ 'app' ]).find(m => Object.keys(m).length === 1);
    const viewsInstance = getOwnerInstance(await waitForElement(`.${app}`));
    findInTree(viewsInstance._reactInternalFiber, n => n && n.historyUnlisten, { walkable: [ 'child', 'stateNode' ] }).forceUpdate();

    // Routes
    const { container } = getModule('container', 'downloadProgressCircle');
    const routesInstance = getOwnerInstance(await waitForElement(`.${container}`));
    routesInstance.forceUpdate();
  }
}
