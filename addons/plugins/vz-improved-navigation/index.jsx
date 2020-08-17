const { React, getModule, getModuleByDisplayName } = require('@webpack');
const { react: { forceUpdateElement } } = require('@utilities');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const Settings = require('./components/Settings');
const MainNav = require('./components/MainNav');

class MainNavigation extends Plugin {
  onStart () {
    vizality.api.settings.registerSettings('improved-navigation', {
      category: 'improved-navigation',
      label: 'improved-navigation',
      render: Settings
    });

    this.injectStyles('scss/style.scss');

    this._injectMainNav(
      this.settings.get('position', 'top'),
      this.settings.get('link-style', 'text')
    );
  }

  onStop () {
    const el = document.querySelector('.vizality-main-nav');
    if (el) el.remove();

    unpatch('vz-mainNav');
  }

  async _injectMainNav (position = 'top', linkStyle = 'text') {
    document.documentElement.setAttribute('vz-main-nav-enabled', '');
    document.documentElement.setAttribute('vz-main-nav-position', this.settings.get('position', 'top'));
    document.documentElement.setAttribute('vz-main-nav-link-style', this.settings.get('link-style', 'text'));

    const { app } = getModule('app', 'layers');

    const Shakeable = getModuleByDisplayName('Shakeable');
    const navBar = React.createElement(MainNav, { position, linkStyle });

    patch('vz-mainNav', Shakeable.prototype, 'render', (_, res) => [ navBar, res ]);

    setImmediate(() => forceUpdateElement(`.${app}`));
  }
}

module.exports = MainNavigation;
