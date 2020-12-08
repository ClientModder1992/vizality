const { ipcRenderer } = require('electron');

const { Regexes } = require('@vizality/constants');
const { Builtin } = require('@vizality/entities');

const Sidebar = require('./components/parts/sidebar/Sidebar');
const Routes = require('./routes/Routes');

module.exports = class Dashboard extends Builtin {
  onStart () {
    this.injectStyles('styles/main.scss');

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
