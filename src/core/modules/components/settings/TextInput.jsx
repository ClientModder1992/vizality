const { getModuleByDisplayName } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const AsyncComponent = require('../AsyncComponent');
const FormItem = require('./FormItem');

const Input = AsyncComponent.from(getModuleByDisplayName('TextInput', true));

module.exports = React.memo(props => {
  const { children: title, note, required } = props;
  delete props.children;

  return (
    <FormItem title={title} note={note} required={required} noteHasMargin>
      <Input {...props} />
    </FormItem>
  );
});
