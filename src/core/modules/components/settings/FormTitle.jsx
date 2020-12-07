const { getModule, getModuleByDisplayName } = require('@vizality/webpack');
const { React } = require('@vizality/react');

const AsyncComponent = require('../AsyncComponent');
const joinClassNames = require('../../util/joinClassNames');

const FormTitle = AsyncComponent.from(getModuleByDisplayName('FormTitle', true));

module.exports = React.memo(props => {
  const { children, className } = props;
  const { marginBottom8 } = getModule('marginBottom8');
  delete props.className;

  return (
    <FormTitle className={joinClassNames(marginBottom8, className)} {...props}>
      {children}
    </FormTitle>
  );
});
