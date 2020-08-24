const { Webpack, Components } = require('@modules');

const Autocomplete = Webpack.getModuleByDisplayName('Autocomplete');

module.exports = class Command extends Autocomplete.Command {
  renderContent () {
    const res = super.renderContent();
    res.props.children[0] = Webpack.React.createElement(Components.Text, {
      children: this.props.prefix ? this.props.prefix : vizality.api.commands.prefix,
      style: { color: '#72767d' }
    });

    return res;
  }
};
