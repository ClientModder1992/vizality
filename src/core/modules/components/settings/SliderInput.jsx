const { getModule, getModuleByDisplayName } = require('@webpack');
const { React } = require('@react');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Slider = AsyncComponent.from(getModuleByDisplayName('Slider', true));

module.exports = class SliderInput extends React.PureComponent {
  render () {
    const { children: title, note, required } = this.props;
    delete this.props.children;

    return (
      <FormItem title={title} note={note} required={required}>
        <Slider {...{
          ...this.props,
          className: `${this.props.className || ''}`.trim()
        }} />
      </FormItem>
    );
  }
};
