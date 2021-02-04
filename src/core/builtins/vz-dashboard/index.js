import React from 'react';

import { patch, unpatch } from '@vizality/patcher';
import { getModule } from '@vizality/webpack';
import { Builtin } from '@vizality/entities';
import { Icon } from '@vizality/components';

import Sidebar from './components/parts/sidebar/Sidebar';
import Routes from './routes/Routes';

export default class Dashboard extends Builtin {
  start () {
    this.injectStyles('styles/main.scss');
    this._injectPrivateTab();
    // this.injectGuildHomeButton();

    vizality.api.routes.registerRoute({
      path: '',
      render: Routes,
      sidebar: Sidebar
    });

    vizality.api.keybinds.registerKeybind({
      keybindId: 'leaveDashboard',
      executor: () => vizality.api.routes.restorePrevious(),
      shortcut: 'esc'
    });

    vizality.api.keybinds.registerKeybind({
      keybindId: 'goToDashboard',
      executor: () => vizality.api.routes.navigateTo(),
      shortcut: 'alt+v'
    });
  }

  stop () {
    vizality.api.routes.unregisterRoute('');
    vizality.api.keybinds.unregisterKeybind('leaveDashboard');
    vizality.api.keybinds.unregisterKeybind('goToDashboard');
    unpatch('vz-dashboard-private-channels-list-item');
  }

  /**
   * Special thanks to Winston and AAGaming for coming up with
   * the original version of this function.
   */
  _injectPrivateTab () {
    const ConnectedPrivateChannelsList = getModule(m => m.default?.displayName === 'ConnectedPrivateChannelsList');
    const { LinkButton } = getModule('LinkButton');

    patch('vz-dashboard-private-channels-list-item', ConnectedPrivateChannelsList, 'default', (_, res) => {
      const selected = window.location.pathname.startsWith('/vizality');
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
    });
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
