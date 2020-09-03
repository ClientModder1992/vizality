const { getModule, getModuleByDisplayName, React } = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const DRadioGroup = AsyncComponent.from(getModuleByDisplayName('RadioGroup', true));

let margin = '';
class RadioGroup extends React.PureComponent {
  constructor () {
    super();
    this.state = { margin };
  }

  async componentDidMount () {
    if (margin !== '') {
      return;
    }

    margin = getModule('marginTop20').marginTop20;
    this.setState({ margin });
  }

  render () {
    const { children: title, note, required } = this.props;
    return (
      <FormItem title={title} note={note} required={required}>
        <DRadioGroup {...this.props} />
      </FormItem>
    );
  }
}

module.exports = RadioGroup;
