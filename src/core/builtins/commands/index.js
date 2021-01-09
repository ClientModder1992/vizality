import React from 'react';

import { HTTP } from '@vizality/constants';
import { getModule } from '@vizality/webpack';
import { patch, unpatch } from '@vizality/patcher';
import { Builtin } from '@vizality/entities';
import { Avatar } from '@vizality/components';

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
  }
}
