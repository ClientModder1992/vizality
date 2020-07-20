const { dom: { waitForElement }, joinClassNames, react: { getOwnerInstance } } = require('@util');
const { PopoutWindow, Tooltip, ContextMenu, Icons: { CodeBraces } } = require('@components');
const { React, getModule, getModuleByDisplayName, contextMenu } = require('@webpack');
const { inject, uninject } = require('@injector');
const { Plugin } = require('@entities');

const SdkWindow = require('./components/SdkWindow');

class SDK extends Plugin {
  constructor () {
    super();
    // @todo: Figure out how to use this for plugins like Titlebar and Main Navigation.
    this._storeListener = this._storeListener.bind(this);
  }

  async startPlugin () {
    this.loadStylesheet('scss/style.scss');
    this.sdkEnabled = vizality.settings.get('sdkEnabled');
    vizality.api.settings.store.addChangeListener(this._storeListener);
    this._addPopoutIcon();
  }

  pluginWillUnload () {
    uninject('vz-sdk-icon');
    vizality.api.settings.store.removeChangeListener(this._storeListener);
  }

  async _addPopoutIcon () {
    const classes = getModule('iconWrapper', 'clickable');
    const HeaderBarContainer = getModuleByDisplayName('HeaderBarContainer');
    inject('vz-sdk-icon', HeaderBarContainer.prototype, 'renderLoggedIn', (originalArgs, returnValue) => {
      if (this.sdkEnabled) {
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
    getOwnerInstance(await waitForElement(`.${title}`)).forceUpdate();
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
}

module.exports = SDK;
