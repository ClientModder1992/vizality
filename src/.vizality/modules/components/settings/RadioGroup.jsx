const Webpack = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const DRadioGroup = AsyncComponent.from(Webpack.getModuleByDisplayName('RadioGroup', true));

let margin = '';
module.exports = class RadioGroup extends Webpack.React.PureComponent {
  constructor () {
    super();
    this.state = { margin };
  }

  async componentDidMount () {
    if (margin !== '') {
      return;
    }

    margin = Webpack.getModule('marginTop20').marginTop20;
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
};
