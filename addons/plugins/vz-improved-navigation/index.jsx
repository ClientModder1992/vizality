const { getModule, getModuleByDisplayName } = require('@webpack');
const { react: { forceUpdateElement } } = require('@util');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');
const { React } = require('@react');

const Settings = require('./components/Settings');
const MainNav = require('./components/MainNav');

module.exports = class MainNavigation extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');
    this._injectMainNav(
      this.settings.get('position', 'top'),
      this.settings.get('link-style', 'text')
    );
    vizality.api.settings.registerSettings('improved-navigation', {
      category: 'improved-navigation',
      label: 'improved-navigation',
      render: Settings
    });
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
};
