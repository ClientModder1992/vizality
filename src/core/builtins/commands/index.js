import { unpatch } from '@vizality/patcher';
import { Builtin } from '@vizality/core';

import monkeypatchMessages from './monkeypatchMessages';
import injectAutocomplete from './injectAutocomplete';

import * as commands from './commands';

export default class Commands extends Builtin {
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
}
