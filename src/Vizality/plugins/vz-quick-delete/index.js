const { react : { findInReactTree } } = require('@util');
const { React, getModule } = require('@webpack');
const { Tooltip, Icon } = require('@components');
const { patch, unpatch } = require('@patcher');
const { Plugin } = require('@entities');

class QuickDelete extends Plugin {
  startPlugin () {
    const { deleteMessage } = getModule('deleteMessage', 'sendMessage');
    const MiniPopover = getModule(m => m.default && m.default.displayName === 'MiniPopover');

    const classes = {
      ...getModule('button', 'wrapper', 'disabled'),
      ...getModule('icon', 'isHeader')
    };

    patch('quick-delete-button', MiniPopover, 'default', (_, res) => {
      const props = findInReactTree(res, r => r && r.canDelete && r.message);

      if (!props) return res;

      const originalType = res.props.children[1].type;

      res.props.children[1].type = props => {
        const res = originalType(props);

        res.props.children.splice(-1, 0,
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
        return res;
      };

      return res;
    });
  }

  pluginWillUnload () {
    unpatch('quick-delete-button');
  }
}

module.exports = QuickDelete;
