const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { React, getModule } = require('vizality/webpack');
const { react : { findInReactTree } } = require('vizality/util');
const { Tooltip, Icon } = require('vizality/components');

module.exports = class QuickDelete extends Plugin {
  startPlugin () {
    const { deleteMessage } = getModule('deleteMessage', 'sendMessage');
    const MiniPopover = getModule(m => m.default && m.default.displayName === 'MiniPopover');

    const classes = {
      ...getModule('button', 'wrapper', 'disabled'),
      ...getModule('icon', 'isHeader')
    };

    inject('quick-delete-button', MiniPopover, 'default', (_, retValue) => {
      const props = findInReactTree(retValue, r => r && r.canDelete && r.message);

      if (!props) return retValue;

      const originalType = retValue.props.children[1].type;

      retValue.props.children[1].type = props => {
        const ret = originalType(props);
        ret.props.children.splice(-1, 0,
          React.createElement(
            Tooltip,
            {
              className: classes.button,
              text: 'Delete',
              position: 'top'
            },
            React.createElement(Icon, {
              wrapperClassName: classes.icon,
              type: 'trash',
              onClick: () => deleteMessage(props.channel.id, props.message.id)
            })
          )
        );
        return ret;
      };

      return retValue;
    });
  }

  pluginWillUnload () {
    uninject('quick-delete-button');
  }
};
