const { dom: { waitForElement }, joinClassNames, react: { getOwnerInstance } } = require('@vizality/util');
const { getModule, getModuleByDisplayName, contextMenu } = require('@vizality/webpack');
const { PopupWindow, Tooltip, ContextMenu, Icon } = require('@vizality/components');
const { patch, unpatch } = require('@vizality/patcher');
const { Builtin } = require('@vizality/entities');
const { React } = require('@vizality/react');

const SdkWindow = require('./components/SdkWindow');

module.exports = class SDK extends Builtin {
  constructor () {
    super();
    // @todo: Figure out how to use this for plugins like Titlebar and Main Navigation.
    this._storeListener = this._storeListener.bind(this);
  }

  onStart () {
    this.injectStyles('styles/main.scss');
    this.sdkEnabled = vizality.settings.get('sdkEnabled');
    vizality.api.settings.store.addChangeListener(this._storeListener);
    this._addPopoutIcon();
  }

  onStop () {
    unpatch('vz-sdk-icon');
    vizality.api.settings.store.removeChangeListener(this._storeListener);
  }

  async _addPopoutIcon () {
    const classes = getModule('iconWrapper', 'clickable');
    const HeaderBarContainer = getModuleByDisplayName('HeaderBarContainer');
    patch('vz-sdk-icon', HeaderBarContainer.prototype, 'renderLoggedIn', (_, res) => {
      if (this.sdkEnabled) {
        const Switcher = React.createElement(Tooltip, {
          className: joinClassNames(classes.iconWrapper, classes.clickable),
          text: 'Vizality SDK',
          position: 'bottom'
        }, React.createElement(Icon, {
          name: 'OpenBox',
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
                    onClick: () => vizality.manager.builtins.get('snippet-manager')._openCustomCSSPopout()
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

        if (!res.props.toolbar) {
          res.props.toolbar = React.createElement(React.Fragment, { children: [] });
        }
        res.props.toolbar.props.children.push(Switcher);
      }
      return res;
    });

    const { title } = getModule('title', 'chatContent');
    getOwnerInstance(await waitForElement(`.${title}`)).forceUpdate();
  }

  async _openSdk () {
    const popoutModule = getModule('setAlwaysOnTop', 'open');
    popoutModule.open('DISCORD_VIZALITY_SANDBOX', (key) =>
      React.createElement(PopupWindow, {
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
