const { Plugin } = require('vizality/entities');
const { uninject } = require('vizality/injector');

const commands = require('./commands');
const monkeypatchMessages = require('./monkeypatchMessages.js');
const injectAutocomplete = require('./injectAutocomplete.js');

module.exports = class Commands extends Plugin {
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
};
