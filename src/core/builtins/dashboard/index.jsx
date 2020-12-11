const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { Regexes } = require('@vizality/constants');
const { Builtin } = require('@vizality/entities');
const { Icon } = require('@vizality/components');
const { React } = require('@vizality/react');

const Sidebar = require('./components/parts/sidebar/Sidebar');
const Routes = require('./routes/Routes');

module.exports = class Dashboard extends Builtin {
  onStart () {
    this.injectStyles('styles/main.scss');
    this.patchTabs();

    vizality.api.router.registerRoute({
      path: '/dashboard',
      render: Routes,
      sidebar: Sidebar
    });

    vizality.api.keybinds.registerKeybind({
      id: 'exit-dashboard',
      executor: this.leaveDashboard,
      shortcut: 'esc'
    });

    vizality.api.keybinds.registerKeybind({
      id: 'go-to-dashboard',
      executor: () => vizality.api.router.navigate('dashboard'),
      shortcut: 'alt+v'
    });
  }

  onStop () {
    vizality.api.router.unregisterRoute('/dashboard');
    vizality.api.keybinds.unregisterKeybind('exit-dashboard');
    vizality.api.keybinds.unregisterKeybind('go-to-dashboard');
    unpatch('vz-dashboard-private-channels-list-item');
  }

  /**
   * Special thanks to Winston and AAGaming for coming up with
   * the original version of this function.
   */
  patchTabs () {
    const ConnectedPrivateChannelsList = getModule(m => m.default?.displayName === 'ConnectedPrivateChannelsList');
    const { LinkButton } = getModule('LinkButton');

    patch('vz-dashboard-private-channels-list-item', ConnectedPrivateChannelsList, 'default', (_, res) => {
      const selected = window.location.pathname === '/vizality/dashboard';
      const index = res?.props?.children.map(c => c?.type?.displayName?.includes('FriendsButtonInner')).indexOf(true) + 1;
      if (selected) {
        res.props?.children.forEach(c => c.props.selected = false);
      }
      res.props.children = [
        ...res.props.children.slice(0, index),
        () =>
          <LinkButton
            icon={() => <Icon name='Vizality' />}
            route='/vizality/dashboard'
            text='Dashboard'
            selected={selected}
          />,
        ...res.props.children.slice(index)
      ];
      return res;
    });
  }

  async leaveDashboard () {
    if (window.location.pathname.startsWith('/vizality/dashboard')) {
      let history = await vizality.native.app.getHistory();
      history = history.reverse();
      history.shift();
      const match = history.find(location => !location.includes('/vizality/dashboard'));
      const route = match.replace(new RegExp(Regexes.DISCORD), '');
      vizality.api.router.navigate(route);
    }
  }
};
