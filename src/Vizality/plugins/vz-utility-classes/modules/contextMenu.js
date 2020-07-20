const { getModuleByDisplayName } = require('@webpack');
const { patch, unpatch } = require('@patcher');

module.exports = () => {
  const ContextMenu = getModuleByDisplayName('FluxContainer(ContextMenus)');

  patch('vz-utility-classes-contextMenu', ContextMenu.prototype, 'render', (_, res) => {
    if (!res.props) return res;

    res.props.isOpen
      ? document.documentElement.setAttribute('vz-context-menu-active', '')
      : document.documentElement.removeAttribute('vz-context-menu-active');

    return res;
  });

  return () => unpatch('vz-utility-classes-contextMenu');
};
