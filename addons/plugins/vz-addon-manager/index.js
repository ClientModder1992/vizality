const { Plugin } = require('@entities');

const commands = require('./commands');
const i18n = require('./i18n');

module.exports = class AddonsManager extends Plugin {
  onStart () {
    this.injectStyles('styles/main.scss');
    vizality.api.i18n.loadAllStrings(i18n);
    Object.values(commands).forEach(cmd => vizality.api.commands.registerCommand(cmd));
  }

  onStop () {
    vizality.api.settings.unregisterSettings('Plugins');
    vizality.api.settings.unregisterSettings('Themes');
    Object.values(commands).forEach(cmd => vizality.api.commands.unregisterCommand(cmd.command));
  }
};
