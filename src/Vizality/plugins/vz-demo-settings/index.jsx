const { Plugin } = require('@entities');

const Settings = require('./components/Settings');

class DemoSettings extends Plugin {
  startPlugin () {
    vizality.api.settings.registerSettings('demo-settings', {
      category: 'demo-settings',
      label: 'demo-settings',
      render: Settings
    });
  }
}

module.exports = DemoSettings;
