import React from 'react';

import { forceUpdateElement } from '@vizality/util/react';
import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Builtin } from '@vizality/entities';
import { Icon } from '@vizality/components';

import Sidebar from './components/parts/sidebar/Sidebar';
import Routes from './routes/Routes';

export default class Dashboard extends Builtin {
  async start () {
    this.injectStyles('styles/main.scss');
    this._injectPrivateTab();
    // this.injectGuildHomeButton();

    vizality.api.routes.registerRoute({
      id: 'home',
      path: '',
      render: Routes,
      sidebar: Sidebar
    });

    vizality.api.actions.registerAction('VIZALITY_CLOSE_DASHBOARD', this._leaveDashboard);
    vizality.api.actions.registerAction('VIZALITY_TOGGLE_DASHBOARD', this._toggleDashboard);

    vizality.api.keybinds.registerKeybind({
      id: 'VIZALITY_CLOSE_DASHBOARD',
      shortcut: 'esc',
      executor: this._leaveDashboard
    });

    vizality.api.keybinds.registerKeybind({
      id: 'VIZALITY_TOGGLE_DASHBOARD',
      shortcut: 'alt+v',
      executor: this._toggleDashboard
    });
  }

  async stop () {
    vizality.api.routes.unregisterRoute('home');
    vizality.api.actions.unregisterAction('VIZALITY_CLOSE_DASHBOARD');
    vizality.api.actions.unregisterAction('VIZALITY_TOGGLE_DASHBOARD');
    vizality.api.keybinds.unregisterKeybind('VIZALITY_CLOSE_DASHBOARD');
    vizality.api.keybinds.unregisterKeybind('VIZALITY_TOGGLE_DASHBOARD');
    unpatch('vz-dashboard-private-channels-list-item');
  }

  /**
   * Goes to the previous non-Vizality dashboard route.
   */
  _leaveDashboard () {
    try {
      vizality.api.routes.restorePreviousRoute();
    } catch (err) {
      this.error(this._labels.concat('_leaveDashboard'), err);
    }
  }

  /**
   * Opens the dashboard if the current route is not a Vizality dashboard route,
   * otherwise goes to the previous non-Vizality dashboard route.
   */
  _toggleDashboard () {
    try {
      const currentRoute = vizality.api.routes.getCurrentRoute();
      if (currentRoute.pathname.startsWith('/vizality')) {
        vizality.api.routes.restorePreviousRoute();
      } else {
        vizality.api.routes.navigateTo('home');
      }
    } catch (err) {
      this.error(this._labels.concat('_toggleDashboard'), err);
    }
  }

  /**
   * Special thanks to Winston and AAGaming for coming up with the original version of this function.
   */
  _injectPrivateTab () {
    try {
      const ConnectedPrivateChannelsList = getModule(m => m.default?.displayName === 'ConnectedPrivateChannelsList');
      const { LinkButton } = getModule('LinkButton');
      const { channel } = getModule('channel', 'closeIcon');
      patch('vz-dashboard-private-channels-list-item', ConnectedPrivateChannelsList, 'default', (_, res) => {
        try {
          const currentRoute = vizality.api.routes.getCurrentRoute();
          const selected = currentRoute.pathname.startsWith('/vizality');
          const index = res.props?.children.map(c => c?.type?.displayName?.includes('FriendsButtonInner')).indexOf(true) + 1;
          if (selected) {
            res.props?.children?.forEach(c => c?.props?.selected ? c.props.selected = false : null);
          }
          res.props.children = [
            ...res.props.children.slice(0, index), () =>
              <LinkButton
                icon={() => <Icon name='Vizality' />}
                route='/vizality'
                text='Dashboard'
                selected={selected}
              />,
            ...res.props.children.slice(index)
          ];
          return res;
        } catch (err) {
          this.error(this._labels.concat('_injectPrivateTab'), err);
        }
      });
      setImmediate(() => forceUpdateElement(`.${channel}`, true));
    } catch (err) {
      this.error(this._labels.concat('_injectPrivateTab'), err);
    }
  }

  // async injectGuildHomeButton () {
  //   const guildClasses = getModule('tutorialContainer');
  //   const guildElement = (await waitForElement(`.${guildClasses.tutorialContainer.split(' ')[0]}`)).parentElement;
  //   const instance = getOwnerInstance(guildElement);

  //   patch('vz-dashboard-guilds-button', instance, 'render', (_, res) => {
  //     const ogRef = res.ref;
  //     const ogChildren = res.props.children;

  //     res.props.children = elem => {
  //       const r = ogChildren(elem);
  //       console.log(elem);
  //       const tee = [ elem.ref.current.children[1].children[1] ];
  //       tee.splice(1, 0, <div class='pie'>Hi lol</div>);
  //       return r;
  //     };
  //     // res.props.children[1].props.children.splice(1, 0, <div class='pie' />);

  //     // pie.splice(1, 0, <div class='pie' />);

  //     return res;
  //   });
  // }
}
