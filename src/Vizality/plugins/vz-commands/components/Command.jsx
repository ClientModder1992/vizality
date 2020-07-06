const { React, getModuleByDisplayName } = require('vizality/webpack');
const { Text } = require('vizality/components');

const Autocomplete = getModuleByDisplayName('Autocomplete');

module.exports = class Command extends Autocomplete.Command {
  renderContent () {
    const res = super.renderContent();
    res.props.children[0] = React.createElement(Text, {
      children: this.props.prefix ? this.props.prefix : vizality.api.commands.prefix,
      style: { color: '#72767d' }
    });

    return res;
  }
};
