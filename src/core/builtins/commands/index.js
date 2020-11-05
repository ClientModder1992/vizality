const { Builtin } = require('@vizality/entities');
const { unpatch } = require('@vizality/patcher');

const monkeypatchMessages = require('./monkeypatchMessages');
const injectAutocomplete = require('./injectAutocomplete');
const commands = require('./commands');

module.exports = class Commands extends Builtin {
  onStart () {
    Object.values(commands).forEach(command => vizality.api.commands.registerCommand(command));
    monkeypatchMessages.call(this);
    injectAutocomplete.call(this);
  }

  onStop () {
    Object.values(commands).forEach(command => vizality.api.commands.unregisterCommand(command.command));
    unpatch('vz-commands-textArea');
    unpatch('vz-commands-plainAutocomplete');
    unpatch('vz-commands-slateAutocomplete');
  }
};
