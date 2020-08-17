const { React, getModule } = require('@webpack');
const { joinClassNames } = require('@utilities');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');
const { Icon } = require('@components');

class ContextMenuIcons extends Plugin {
  onStart () {
    this.injectStyles('style.scss');

    this._injectContextMenuItems();
    this._injectContextMenuCheckboxItems();
    this._injectContextMenuControlItems();
  }

  onStop () {
    unpatch('vz-contextMenuIcons');
    unpatch('vz-contextMenuCheckboxIcons');
    unpatch('vz-contextMenuControlIcons');
  }

  async _injectContextMenuItems () {
    const MenuItem = getModule(m => m.default && m.default.displayName === 'MenuItem');

    patch('vz-contextMenuIcons', MenuItem, 'default', (_, res) => {
      if (!res.props || !res.props.id) return res;

      const { id } = res.props;

      res.props.className = joinClassNames(res.props.className, 'vz-hasIcon');

      const type = [
        id === 'textarea-context-languages' && 'atom',
        id === 'textarea-context-copy' && 'atom',
        id === 'textarea-context-cut' && 'atom',
        id === 'textarea-context-paste' && 'atom',

        id === 'user-context-user-profile' && 'atom',
        id === 'user-context-mention' && 'atom',
        id === 'user-context-message-user' && 'atom',
        id === 'user-context-call' && 'atom',
        id === 'user-context-note' && 'atom',
        id === 'user-context-invite-to-server' && 'atom',
        id === 'user-context-add-friend' && 'atom',
        id === 'user-context-remove-friend' && 'atom',
        id === 'user-context-block' && 'atom',
        id === 'user-context-roles' && 'atom',
        id === 'user-context-devmode-copy-id' && 'atom',

        id === 'message-add-reaction' && 'atom',
        id === 'message-edit' && 'atom',
        id === 'message-pin' && 'atom',
        id === 'message-quote' && 'atom',
        id === 'message-mark-unread' && 'atom',
        id === 'message-copy-link' && 'atom',
        id === 'message-copy-native-link' && 'atom',
        id === 'message-open-native-link' && 'atom',
        id === 'message-delete' && 'atom',
        id === 'message-devmode-copy-id' && 'atom'
      ].filter(Boolean).join(' ');

      if (!type) {
        console.log('Context item not specified yet: ', id);
        return res;
      }

      const icon = React.createElement(Icon, { type, className: 'vizality-contextMenuIcon' });

      res.props.children.unshift(icon);

      return res;
    });
  }

  async _injectContextMenuCheckboxItems () {
    const MenuCheckboxItem = getModule(m => m.default && m.default.displayName === 'MenuCheckboxItem');

    patch('vz-contextMenuCheckboxIcons', MenuCheckboxItem, 'default', (_, res) => {
      if (!res.props || !res.props.id) return res;

      const { id } = res.props;

      res.props.className = joinClassNames(res.props.className, 'vz-hasIcon');

      const type = [
        id === 'textarea-context-spellcheck' && 'atom',

        id === 'user-context-disable-video' && 'atom',
        id === 'user-context-mute' && 'atom'
      ].filter(Boolean).join(' ');

      if (!type) {
        console.log('Context checkbox item not specified yet: ', id);
        return res;
      }

      const icon = React.createElement(Icon, { type, className: 'vizality-contextMenuIcon' });

      res.props.children.unshift(icon);

      return res;
    });
  }

  async _injectContextMenuControlItems () {
    const MenuControlItem = getModule(m => m.default && m.default.displayName === 'MenuControlItem');

    patch('vz-contextMenuControlIcons', MenuControlItem, 'default', (_, res) => {
      if (!res.props || !res.props.id || !res.props.children || !res.props.children[0].props) return res;

      const { id } = res.props;

      res.props.className = joinClassNames(res.props.className, 'vz-hasIcon');

      const type = [
        id === 'user-context-user-volume' && 'atom'
      ].filter(Boolean).join(' ');

      if (!type) {
        console.log('Context checkbox item not specified yet: ', id);
        return res;
      }

      const icon = React.createElement(Icon, { type, className: 'vizality-contextMenuIcon' });

      res.props.children.unshift(icon);

      return res;
    });
  }
}

module.exports = ContextMenuIcons;
