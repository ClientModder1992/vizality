const { React, getModule, getModuleByDisplayName } = require('@webpack');
const { react: { forceUpdateElement } } = require('@util');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

const Settings = require('./components/Settings');
const Titlebar = require('./components/Titlebar');

class ImprovedTitlebar extends Plugin {
  onStart () {
    vizality.api.settings.registerSettings('improved-titlebar', {
      category: 'improved-titlebar',
      label: 'improved-titlebar',
      render: Settings
    });

    this.injectStyles('style.scss');

    this._injectTitlebar(
      this.settings.get('type', 'windows'),
      this.settings.get('showHeader', true),
      this.settings.get('headerText', 'Vizality'),
      this.settings.get('showExtras', false)
    );
  }

  onStop () {
    const el = document.querySelector('.vizality-titlebar');
    if (el) el.remove();

    unpatch('advancedTitlebar-titlebar');
    /*
     * @todo: impl; re-render normal titlebar (so none if linux)
     */
  }

  async _injectTitlebar (type, showHeader, headerText, showExtras) {
    const { app } = getModule('app', 'layers');
    document.documentElement.setAttribute('titlebar-type', this.settings.get('type', 'windows'));
    const Shakeable = getModuleByDisplayName('Shakeable');
    const titlebar = React.createElement(Titlebar, { type, showHeader, headerText, showExtras });
    patch('advancedTitlebar-titlebar', Shakeable.prototype, 'render', (_, res) => [ titlebar, res ]);

    setImmediate(() => forceUpdateElement(`.${app}`));
  }
}

module.exports = ImprovedTitlebar;
