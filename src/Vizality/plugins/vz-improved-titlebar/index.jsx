const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { React, getModule, getModuleByDisplayName } = require('vizality/webpack');
const { react: { forceUpdateElement } } = require('vizality/util');

const Settings = require('./components/Settings');
const Titlebar = require('./components/Titlebar');

module.exports = class ImprovedTitlebar extends Plugin {
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
    const { app } = getModule([ 'app', 'layers' ], true);
    document.documentElement.setAttribute('titlebar-type', this.settings.get('type', 'windows'));
    const Shakeable = await getModuleByDisplayName('Shakeable', true);
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
};
