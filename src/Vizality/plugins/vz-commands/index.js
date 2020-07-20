const { Plugin } = require('@entities');
const { uninject } = require('@injector');

const commands = require('./commands');
const monkeypatchMessages = require('./monkeypatchMessages.js');
const injectAutocomplete = require('./injectAutocomplete.js');

class Commands extends Plugin {
  startPlugin () {
    Object.values(commands).forEach(command => vizality.api.commands.registerCommand(command));

    monkeypatchMessages.call(this);
    injectAutocomplete.call(this);
  }

  pluginWillUnload () {
    Object.values(commands).forEach(command => vizality.api.commands.unregisterCommand(command.command));
    uninject('vz-commands-autocomplete-prefix');
    uninject('vz-commands-autocomplete');
  }
}

module.exports = Commands;
