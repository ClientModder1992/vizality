const Webpack = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Slider = AsyncComponent.from(Webpack.getModuleByDisplayName('Slider', true));

module.exports = class SliderInput extends Webpack.React.PureComponent {
  render () {
    const { marginTop20 } = getModule('marginTop20');
    const { children: title, note, required } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required}>
        <Slider {...{
          ...this.props,
          className: `${this.props.className || ''} ${marginTop20}`.trim()
        }} />
      </FormItem>
    );
  }
};
