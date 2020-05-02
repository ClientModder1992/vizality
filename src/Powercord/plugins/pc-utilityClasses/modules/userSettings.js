const { getModuleByDisplayName } = require('powercord/webpack');
const { inject, uninject } = require('powercord/injector');
const { sleep } = require('powercord/util');

module.exports = async () => {
  const TabBar = await getModuleByDisplayName('TabBar');
  inject('pc-utilitycls-settingsSidebar', TabBar.prototype, 'render', function (_, res) {
    res.props['data-selected-item'] = this.props.selectedItem;

    const TabBarItems = res.props.children;

    // @TODO: Fix this...
    for (const item of TabBarItems) {
      if (item && item.props && item.props.id) {
        item.props['data-item'] = item.props.id;
      }
    }
    return res;
  });


  return async () => {
    uninject('pc-utilitycls-sidebar');
  };
};
