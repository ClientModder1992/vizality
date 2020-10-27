const { Plugin } = require('@entities');

const Settings = require('./components/Settingsold');

module.exports = class DemoSettings extends Plugin {
  onStart () {
    vizality.api.settings.registerDashboardSettings({
      id: 'vz-demo-settings',
      render: Settings
    });
  }
};
