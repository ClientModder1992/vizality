import React from 'react';

import { getModuleByDisplayName } from '@vizality/webpack';
import { Text } from '@vizality/components';

const Autocomplete = getModuleByDisplayName('Autocomplete');

export default class Command extends Autocomplete.Command {
  renderContent () {
    const res = super.renderContent();
    res.props.children[0] =
      <Text style={{ color: '#72767d' }}>
        {this.props.prefix
          ? this.props.prefix
          : vizality.api.commands.prefix
        }
      </Text>;

    return res;
  }
}
