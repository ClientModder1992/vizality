const Webpack = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Input = AsyncComponent.from(Webpack.getModuleByDisplayName('TextInput', true));

module.exports = class TextInput extends Webpack.React.PureComponent {
  render () {
    const { children: title, note, required } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required} noteHasMargin>
        <Input {...this.props} />
      </FormItem>
    );
  }
};
