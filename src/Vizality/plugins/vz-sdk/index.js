const { React, getModule, getModuleByDisplayName, contextMenu } = require('vizality/webpack');
const { PopoutWindow, Tooltip, ContextMenu, Icons: { CodeBraces } } = require('vizality/components');
const { inject, uninject } = require('vizality/injector');
const { dom: { waitFor }, joinClassNames, react: { getOwnerInstance } } = require('vizality/util');
const { Plugin } = require('vizality/entities');
const SdkWindow = require('./components/SdkWindow');

module.exports = class SDK extends Plugin {
  constructor () {
    super();
    this._storeListener = this._storeListener.bind(this);
  }

  async startPlugin () {
    vizality.api.labs.registerExperiment({
      id: 'vz-sdk',
      name: 'Sandbox Development Kit',
      date: 1591011180411,
      description: 'Vizality\'s sandbox development kit for plugin and theme developers',
      callback: () => void 0
    });

    this.loadStylesheet('scss/style.scss');
    this.sdkEnabled = vizality.settings.get('sdkEnabled');
    vizality.api.settings.store.addChangeListener(this._storeListener);
    this._addPopoutIcon();
  }

  pluginWillUnload () {
    uninject('vz-sdk-icon');
    vizality.api.settings.store.removeChangeListener(this._storeListener);
    vizality.api.labs.unregisterExperiment('vz-sdk');
  }

  async _addPopoutIcon () {
    const classes = getModule('iconWrapper', 'clickable');
    const HeaderBarContainer = getModuleByDisplayName('HeaderBarContainer');
    inject('vz-sdk-icon', HeaderBarContainer.prototype, 'renderLoggedIn', (originalArgs, returnValue) => {
      if (vizality.api.labs.isExperimentEnabled('vz-sdk') && this.sdkEnabled) {
        const Switcher = React.createElement(Tooltip, {
          className: joinClassNames(classes.iconWrapper, classes.clickable),
          text: 'Vizality SDK',
          position: 'bottom'
        }, React.createElement(CodeBraces, {
          className: classes.icon,
          onClick: () => this._openSdk(),
          onContextMenu: (e) => {
            contextMenu.openContextMenu(e, () =>
              React.createElement(ContextMenu, {
                width: '50px',
                itemGroups: [ [
                  {
                    type: 'button',
                    name: 'Open Vizality SDK Window',
                    onClick: () => this._openSdk()
                  },
                  {
                    type: 'button',
                    name: 'Open QuickCSS Window',
                    onClick: () => vizality.pluginManager.get('vz-module-manager')._openQuickCSSPopout()
                  }
                ], [
                  {
                    type: 'button',
                    color: 'colorDanger',
                    name: 'Restart Discord',
                    onClick: () => DiscordNative.app.relaunch()
                  }
                ] ]
              })
            );
          }
        }));

        if (!returnValue.props.toolbar) {
          returnValue.props.toolbar = React.createElement(React.Fragment, { children: [] });
        }
        returnValue.props.toolbar.props.children.push(Switcher);
      }
      return returnValue;
    });

    const { title } = getModule('title', 'chatContent');
    getOwnerInstance(await waitFor(`.${title}`)).forceUpdate();
  }

  async _openSdk () {
    const popoutModule = getModule('setAlwaysOnTop', 'open');
    popoutModule.open('DISCORD_VIZALITY_SANDBOX', (key) =>
      React.createElement(PopoutWindow, {
        windowKey: key,
        title: 'SDK'
      }, React.createElement(SdkWindow))
    );
    popoutModule.setAlwaysOnTop('DISCORD_VIZALITY_SANDBOX', true);
  }

  _storeListener () {
    if (this.sdkEnabled !== vizality.settings.get('sdkEnabled')) {
      this.sdkEnabled = vizality.settings.get('sdkEnabled');
      const { title } = getModule('title', 'chatContent');
      getOwnerInstance(document.querySelector(`.${title}`)).forceUpdate();
    }
  }
};
