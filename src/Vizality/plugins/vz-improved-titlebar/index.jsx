const { React, getModule, getModuleByDisplayName } = require('@webpack');
const { react: { forceUpdateElement } } = require('@util');
const { inject, uninject } = require('@injector');
const { Plugin } = require('@entities');

const Settings = require('./components/Settings');
const Titlebar = require('./components/Titlebar');

class ImprovedTitlebar extends Plugin {
  startPlugin () {
    vizality.api.settings.registerSettings('improved-titlebar', {
      category: 'improved-titlebar',
      label: 'improved-titlebar',
      render: Settings
    });
    this.loadStylesheet('style.scss');

    this._injectTitlebar(
      this.settings.get('type', 'windows'),
      this.settings.get('showHeader', true),
      this.settings.get('headerText', 'Vizality'),
      this.settings.get('showExtras', false)
    );
  }

  async _injectTitlebar (type, showHeader, headerText, showExtras) {
    const { app } = getModule('app', 'layers');
    document.documentElement.setAttribute('titlebar-type', this.settings.get('type', 'windows'));
    const Shakeable = getModuleByDisplayName('Shakeable');
    const titlebar = React.createElement(Titlebar, { type, showHeader, headerText, showExtras });
    inject('advancedTitlebar-titlebar', Shakeable.prototype, 'render', (originalArgs, returnValue) => [ titlebar, returnValue ]);

    setImmediate(() => forceUpdateElement(`.${app}`));
  }

  pluginWillUnload () {
    const el = document.querySelector('.vizality-titlebar');
    if (el) el.remove();

    uninject('advancedTitlebar-titlebar');
    /*
     * @todo: impl; re-render normal titlebar (so none if linux)
     */
  }
}

module.exports = ImprovedTitlebar;
