const { inject, uninject } = require('@injector');
const { React, getModule } = require('@webpack');
const { joinClassNames } = require('@util');
const { Plugin } = require('@entities');
const { Icon } = require('@components');

class ContextMenuIcons extends Plugin {
  startPlugin () {
    this.loadStylesheet('style.scss');

    this._injectContextMenuItems();
    this._injectContextMenuCheckboxItems();
    this._injectContextMenuControlItems();
  }

  async _injectContextMenuItems () {
    const MenuItem = getModule(m => m.default && m.default.displayName === 'MenuItem');

    inject('vz-contextMenuIcons', MenuItem, 'default', (originalArgs, returnValue) => {
      if (!returnValue.props || !returnValue.props.id) return returnValue;

      const { id } = returnValue.props;

      returnValue.props.className = joinClassNames(returnValue.props.className, 'vz-hasIcon');

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
        return returnValue;
      }

      const icon = React.createElement(Icon, { type,
        className: 'vizality-contextMenuIcon' });
      returnValue.props.children.unshift(icon);

      return returnValue;
    });
  }

  async _injectContextMenuCheckboxItems () {
    const MenuCheckboxItem = getModule(m => m.default && m.default.displayName === 'MenuCheckboxItem');

    inject('vz-contextMenuCheckboxIcons', MenuCheckboxItem, 'default', (originalArgs, returnValue) => {
      if (!returnValue.props || !returnValue.props.id) return returnValue;

      const { id } = returnValue.props;

      returnValue.props.className = joinClassNames(returnValue.props.className, 'vz-hasIcon');

      const type = [
        id === 'textarea-context-spellcheck' && 'atom',

        id === 'user-context-disable-video' && 'atom',
        id === 'user-context-mute' && 'atom'
      ].filter(Boolean).join(' ');

      if (!type) {
        console.log('Context checkbox item not specified yet: ', id);
        return returnValue;
      }

      const icon = React.createElement(Icon, { type,
        className: 'vizality-contextMenuIcon' });
      returnValue.props.children.unshift(icon);

      return returnValue;
    });
  }

  async _injectContextMenuControlItems () {
    const MenuControlItem = getModule(m => m.default && m.default.displayName === 'MenuControlItem');

    inject('vz-contextMenuControlIcons', MenuControlItem, 'default', (originalArgs, returnValue) => {
      if (!returnValue.props || !returnValue.props.id || !returnValue.props.children || !returnValue.props.children[0].props) return returnValue;

      const { id } = returnValue.props;

      returnValue.props.className = joinClassNames(returnValue.props.className, 'vz-hasIcon');

      const type = [
        id === 'user-context-user-volume' && 'atom'
      ].filter(Boolean).join(' ');

      if (!type) {
        console.log('Context checkbox item not specified yet: ', id);
        return returnValue;
      }

      const icon = React.createElement(Icon, { type,
        className: 'vizality-contextMenuIcon' });
      returnValue.props.children.unshift(icon);

      return returnValue;
    });
  }

  pluginWillUnload () {
    uninject('vz-contextMenuIcons');
    uninject('vz-contextMenuCheckboxIcons');
    uninject('vz-contextMenuControlIcons');
  }
}

module.exports = ContextMenuIcons;
