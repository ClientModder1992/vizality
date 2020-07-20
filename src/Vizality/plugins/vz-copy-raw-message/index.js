const { inject, uninject } = require('@injector');
const { React, getModule } = require('@webpack');
const { Plugin } = require('@entities');
const { Menu } = require('@components');

class CopyRawMessage extends Plugin {
  startPlugin () {
    this._patchContextMenu();
  }

  pluginWillUnload () {
    uninject('copy-raw-message');
  }

  async _patchContextMenu () {
    const MessageContextMenu = getModule(m => m.default && m.default.displayName === 'MessageContextMenu');

    inject('copy-raw-message', MessageContextMenu, 'default', ([ props ], res) => {
      const { message } = props;

      if (!message || !message.content) return res;

      res.props.children.push(
        React.createElement(Menu.MenuItem, {
          label: 'Copy Raw Message',
          id: 'copy-raw-message',
          action: async () => DiscordNative.clipboard.copy(message.content)
        })
      );

      return res;
    });
  }
}

module.exports = CopyRawMessage;
