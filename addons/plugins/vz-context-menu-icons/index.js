const { joinClassNames } = require('@vizality/util');
const { patch, unpatch } = require('@vizality/patcher');
const { getModule } = require('@vizality/webpack');
const { Plugin } = require('@vizality/entities');
const { Icon } = require('@vizality/components');
const { React } = require('@vizality/react');

module.exports = class ContextMenuIcons extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');
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
        id === 'textarea-context-languages' && 'Science',
        id === 'textarea-context-copy' && 'Science',
        id === 'textarea-context-cut' && 'Science',
        id === 'textarea-context-paste' && 'Science',

        id === 'user-context-user-profile' && 'Science',
        id === 'user-context-mention' && 'Science',
        id === 'user-context-message-user' && 'Science',
        id === 'user-context-call' && 'Science',
        id === 'user-context-note' && 'Science',
        id === 'user-context-invite-to-server' && 'Science',
        id === 'user-context-add-friend' && 'Science',
        id === 'user-context-remove-friend' && 'Science',
        id === 'user-context-block' && 'Science',
        id === 'user-context-roles' && 'Science',
        id === 'user-context-devmode-copy-id' && 'Science',

        id === 'message-add-reaction' && 'Science',
        id === 'message-edit' && 'Science',
        id === 'message-pin' && 'Science',
        id === 'message-quote' && 'Science',
        id === 'message-mark-unread' && 'Science',
        id === 'message-copy-link' && 'Science',
        id === 'message-copy-native-link' && 'Science',
        id === 'message-open-native-link' && 'Science',
        id === 'message-delete' && 'Science',
        id === 'message-devmode-copy-id' && 'Science'
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
        id === 'textarea-context-spellcheck' && 'Science',

        id === 'user-context-disable-video' && 'Science',
        id === 'user-context-mute' && 'Science'
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
        id === 'user-context-user-volume' && 'Science'
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
};
