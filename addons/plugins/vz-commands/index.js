const { Patcher, Entities: { Plugin } } = require('@modules');

const commands = require('./commands');
const monkeypatchMessages = require('./monkeypatchMessages.js');
const injectAutocomplete = require('./injectAutocomplete.js');

module.exports = class Commands extends Plugin {
  onStart () {
    Object.values(commands).forEach(command => vizality.api.commands.registerCommand(command));
    monkeypatchMessages.call(this);
    injectAutocomplete.call(this);
  }

  onStop () {
    Object.values(commands).forEach(command => vizality.api.commands.unregisterCommand(command.command));
    Patcher.unpatch('vz-commands-autocomplete-prefix');
    Patcher.unpatch('vz-commands-autocomplete');
  }
};
