const { Plugin } = require('@entities');
const { unpatch } = require('@patcher');

const commands = require('./commands');
const monkeypatchMessages = require('./monkeypatchMessages.js');
const injectAutocomplete = require('./injectAutocomplete.js');

class Commands extends Plugin {
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
}

module.exports = Commands;
