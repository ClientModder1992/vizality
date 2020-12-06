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
  }

  onStop () {
    vizality.api.router.unregisterRoute('/dashboard');
  }
};
