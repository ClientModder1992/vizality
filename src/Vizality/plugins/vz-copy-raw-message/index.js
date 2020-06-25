const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { React, getModule } = require('vizality/webpack');
const { Menu } = require('vizality/components');

module.exports = class CopyRawMessage extends Plugin {
  startPlugin () {
    this._patchContextMenu();
  }

  pluginWillUnload () {
    uninject('copy-raw-message');
  }

  async _patchContextMenu () {
    const MessageContextMenu = await getModule(m => m.default && m.default.displayName === 'MessageContextMenu');

    inject('copy-raw-message', MessageContextMenu, 'default', ([ props ], returnValue) => {
      const { message } = props;

      if (!message || !message.content) return returnValue;

      returnValue.props.children.push(
        React.createElement(Menu.MenuItem, {
          label: 'Copy Raw Message',
          id: 'copy-raw-message',
          action: async () => DiscordNative.clipboard.copy(message.content)
        })
      );

      return returnValue;
    });
  }
};
