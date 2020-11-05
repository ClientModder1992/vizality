const { getModule, getModuleByDisplayName } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const AsyncComponent = require('../AsyncComponent');
const Divider = require('../Divider');

const FormItem = AsyncComponent.from(getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText', true));

module.exports = React.memo(props => {
  const Flex = getModuleByDisplayName('Flex');
  const margins = getModule('marginTop20');
  const { description } = getModule('formText', 'description');
  // @todo Make this use joinClassNames.
  const noteClasses = [ description, props.noteHasMargin && margins.marginTop8 ].filter(Boolean).join(' ');

  return (
    <FormItem
      title={props.title}
      required={props.required}
      className={`${Flex.Direction.VERTICAL} ${Flex.Justify.START} ${Flex.Align.STRETCH} ${Flex.Wrap.NO_WRAP} ${margins.marginBottom20}`}
    >
      {props.children}
      {props.note && <FormText className={noteClasses}>{props.note}</FormText>}
      <Divider/>
    </FormItem>
  );
});
