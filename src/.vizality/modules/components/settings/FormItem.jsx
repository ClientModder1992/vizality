const { getModule, getModuleByDisplayName, React } = require('@webpack');
const { joinClassNames } = require('@utilities');

const AsyncComponent = require('../AsyncComponent');
const Divider = require('../Divider');

const DFormItem = AsyncComponent.from(getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText', true));

class FormItem extends React.PureComponent {
  render () {
    const Flex = getModuleByDisplayName('Flex');
    const margins = getModule('marginTop20');
    const { description } = getModule('formText', 'description');
    // @todo Make this use joinClassNames.
    const noteClasses = [ description, this.props.noteHasMargin && margins.marginTop8 ].filter(Boolean).join(' ');
    return (
      <DFormItem
        title={this.props.title}
        required={this.props.required}
        className={`${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP} ${margins.marginBottom20}`}
      >
        {this.props.children}
        {this.props.note && <FormText className={noteClasses}>{this.props.note}</FormText>}
        <Divider/>
      </DFormItem>
    );
  }
}

module.exports = FormItem;
