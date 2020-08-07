const { Plugin } = require('@entities');

const Settings = require('./components/Settings');

class DemoSettings extends Plugin {
  onStart () {
    vizality.api.settings.registerSettings('demo-settings', {
      category: 'demo-settings',
      label: 'demo-settings',
      render: Settings
    });
  }
}

module.exports = DemoSettings;
