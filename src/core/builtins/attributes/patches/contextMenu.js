const { getModuleByDisplayName } = require('@vizality/webpack');
const { patch, unpatch } = require('@vizality/patcher');

module.exports = () => {
  const ContextMenu = getModuleByDisplayName('FluxContainer(ContextMenus)');

  patch('vz-attributes-contextMenu', ContextMenu.prototype, 'render', (_, res) => {
    if (!res.props) return res;

    res.props.isOpen
      ? document.documentElement.setAttribute('vz-context-menu-active', '')
      : document.documentElement.removeAttribute('vz-context-menu-active');

    return res;
  });

  return () => unpatch('vz-attributes-contextMenu');
};
