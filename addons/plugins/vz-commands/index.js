const { Plugin } = require('@entities');
const { unpatch } = require('@patcher');

const commands = require('./commands');
const monkeypatchMessages = require('./monkeypatchMessages');
const injectAutocomplete = require('./injectAutocomplete');

module.exports = class Commands extends Plugin {
  onStart () {
    Object.values(commands).forEach(command => vizality.api.commands.registerCommand(command));
    monkeypatchMessages.call(this);
    injectAutocomplete.call(this);
  }

  onStop () {
    Object.values(commands).forEach(command => vizality.api.commands.unregisterCommand(command.command));
    unpatch('vz-commands-autocomplete-prefix');
    unpatch('vz-commands-autocomplete');
  }
};
