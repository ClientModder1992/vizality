const Webpack = require('@webpack');

const AsyncComponent = require('../AsyncComponent');
const Divider = require('../Divider');

const DFormItem = AsyncComponent.from(Webpack.getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(Webpack.getModuleByDisplayName('FormText', true));

module.exports = class FormItem extends Webpack.React.PureComponent {
  render () {
    const Flex = Webpack.getModuleByDisplayName('Flex');
    const margins = Webpack.getModule('marginTop20');
    const { description } = Webpack.getModule('formText', 'description');
    return (
      <DFormItem
        title={this.props.title}
        required={this.props.required}
        className={`${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP} ${margins.marginBottom20}`}
      >
        {this.props.children}
        <FormText
          className={[ description, this.props.noteHasMargin && margins.marginTop8 ].filter(Boolean).join(' ')}
        >
          {this.props.note}
        </FormText>
        <Divider/>
      </DFormItem>
    );
  }
};
