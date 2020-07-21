const { React, getModuleByDisplayName } = require('@webpack');
const { Text } = require('@components');

const Autocomplete = getModuleByDisplayName('Autocomplete');

class Command extends Autocomplete.Command {
  renderContent () {
    const res = super.renderContent();
    res.props.children[0] = React.createElement(Text, {
      children: this.props.prefix ? this.props.prefix : vizality.api.commands.prefix,
      style: { color: '#72767d' }
    });

    return res;
  }
}

module.exports = Command;
