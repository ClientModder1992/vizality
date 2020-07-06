const { getModuleByDisplayName, React } = require('vizality/webpack');
const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const SelectTempWrapper = AsyncComponent.from(getModuleByDisplayName('SelectTempWrapper', true));

class SelectInput extends React.PureComponent {
  render () {
    const { children: title, note, required } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required} noteHasMargin>
        <SelectTempWrapper {...this.props}/>
      </FormItem>
    );
  }
}

module.exports = SelectInput;
