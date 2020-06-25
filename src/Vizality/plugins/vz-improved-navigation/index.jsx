const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { React, getModule, getModuleByDisplayName } = require('vizality/webpack');
const { forceUpdateElement } = require('vizality/util');

const Settings = require('./components/Settings');
const MainNav = require('./components/MainNav');

module.exports = class MainNavigation extends Plugin {
  startPlugin () {
    vizality.api.settings.registerSettings('improved-navigation', {
      category: 'improved-navigation',
      label: 'improved-navigation',
      render: Settings
    });

    this.loadStylesheet('scss/style.scss');

    this._injectMainNav(
      this.settings.get('position', 'top'),
      this.settings.get('link-style', 'text')
    );
  }

  async _injectMainNav (position = 'top', linkStyle = 'text') {
    document.documentElement.setAttribute('vz-main-nav-enabled', '');
    document.documentElement.setAttribute('vz-main-nav-position', this.settings.get('position', 'top'));
    document.documentElement.setAttribute('vz-main-nav-link-style', this.settings.get('link-style', 'text'));

    const { app } = await getModule([ 'app', 'layers' ]);

    const Shakeable = await getModuleByDisplayName('Shakeable');
    const navBar = React.createElement(MainNav, { position, linkStyle });

    inject('vz-mainNav', Shakeable.prototype, 'render', (originalArgs, returnValue) => [ navBar, returnValue ]);

    setImmediate(() => forceUpdateElement(`.${app}`));
  }

  pluginWillUnload () {
    const el = document.querySelector('.vizality-main-nav');

    if (el) {
      el.remove();
    }

    uninject('vz-mainNav');
  }
};
