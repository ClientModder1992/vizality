/**
 * @todo There are some more things that need to be done for commands:
 * - An error occurs in console when you click a rail icon
 * - Add the ability to collapse categories (Discord hasn't even added this yet,
 * though it's clear they intend to)
 * - There is a bug with arrow key navigation where the list doesn't scroll
 * - Currently selected rail item doesn't update (the index does update, but need
 * to figure out how to force update)
 * - Consider adding a back arrow button to the header for subcommand autocompletes
 */

import { Builtin } from '@vizality/entities';
import { unpatch } from '@vizality/patcher';

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
    unpatch('vz-commands-commandItem');
    unpatch('vz-commands-railIcon');
  }
}
