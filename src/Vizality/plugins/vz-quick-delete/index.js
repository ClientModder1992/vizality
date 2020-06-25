const { Plugin } = require('vizality/entities');
const { inject, uninject } = require('vizality/injector');
const { React, getModule } = require('vizality/webpack');
const { findInReactTree } = require('vizality/util');
const { Tooltip, Icon } = require('vizality/components');

module.exports = class QuickDelete extends Plugin {
  async startPlugin () {
    const deleteMessage = await getModule([ 'deleteMessage', 'sendMessage' ]);
    const MiniPopover = await getModule(m => m.default && m.default.displayName === 'MiniPopover');

    const classes = {
      ...getModule([ 'button', 'wrapper', 'disabled' ], false),
      ...getModule([ 'icon', 'isHeader' ], false)
    };

    inject('quick-delete-button', MiniPopover, 'default', (originalArgs, returnValue) => {
      const props = findInReactTree(returnValue, r => r && r.canDelete && r.message);

      if (!props) return returnValue;

      const oType = returnValue.props.children[1].type;
      returnValue.props.children[1].type = props => {
        const ret = oType(props);
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
              onClick: () => deleteMessage.deleteMessage(props.channel.id, props.message.id)
            })
          )
        );
        return ret;
      };

      return returnValue;
    });

    MiniPopover.default.displayName = 'MiniPopover';
  }

  pluginWillUnload () {
    uninject('quick-delete-button');
  }
};
