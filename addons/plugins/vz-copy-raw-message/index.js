const { patch, unpatch } = require('@patcher');
const { getModule } = require('@webpack');
const { Plugin } = require('@entities');
const { Menu } = require('@components');
const { React } = require('@react');

module.exports = class CopyRawMessage extends Plugin {
  onStart () {
    this._patchContextMenu();
  }

  onStop () {
    unpatch('copy-raw-message');
  }

  async _patchContextMenu () {
    const MessageContextMenu = getModule(m => m.default && m.default.displayName === 'MessageContextMenu');

    patch('copy-raw-message', MessageContextMenu, 'default', ([ props ], res) => {
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
};
