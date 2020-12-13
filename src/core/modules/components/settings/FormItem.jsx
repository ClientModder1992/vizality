const { getModule, getModuleByDisplayName } = require('@vizality/webpack');
const { joinClassNames } = require('@vizality/util');
const { React } = require('@vizality/react');

const AsyncComponent = require('../AsyncComponent');
const Divider = require('../Divider');

const FormItem = AsyncComponent.from(getModuleByDisplayName('FormItem', true));
const FormText = AsyncComponent.from(getModuleByDisplayName('FormText', true));

module.exports = React.memo(props => {
  const { description } = getModule('formText', 'description');
  const Flex = getModuleByDisplayName('Flex');
  const margins = getModule('marginTop20');
  const noteClasses = joinClassNames(description, { [margins.marginTop8]: props.noteHasMargin });

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
