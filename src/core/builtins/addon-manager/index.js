const { Builtin } = require('@vizality/entities');

const commands = require('./commands');
const i18n = require('./i18n');

module.exports = class AddonsManager extends Builtin {
  onStart () {
    this.injectStyles('styles/main.scss');
    vizality.api.i18n.loadAllStrings(i18n);
    Object.values(commands).forEach(cmd => vizality.api.commands.registerCommand(cmd));
  }

  onStop () {
    Object.values(commands).forEach(cmd => vizality.api.commands.unregisterCommand(cmd.command));
  }
};
