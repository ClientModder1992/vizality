const { getModuleByDisplayName } = require('@webpack');
const { inject, uninject } = require('@injector');

module.exports = () => {
  const ContextMenu = getModuleByDisplayName('FluxContainer(ContextMenus)');

  inject('vz-utility-classes-contextMenu', ContextMenu.prototype, 'render', (_, res) => {
    if (!res.props) return res;

    res.props.isOpen
      ? document.documentElement.setAttribute('vz-context-menu-active', '')
      : document.documentElement.removeAttribute('vz-context-menu-active');

    return res;
  });

  return () => uninject('vz-utility-classes-contextMenu');
};
