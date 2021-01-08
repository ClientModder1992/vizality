import { unpatch } from '@vizality/patcher';
import { Builtin } from '@vizality/entities';

import monkeypatchMessages from './monkeypatchMessages';
import injectAutocomplete from './injectAutocomplete';

export default class Commands extends Builtin {
  onStart () {
    monkeypatchMessages.call(this);
    injectAutocomplete.call(this);
  }

  onStop () {
    unpatch('vz-commands-textArea');
    unpatch('vz-commands-plainAutocomplete');
    unpatch('vz-commands-slateAutocomplete');
  }
}
