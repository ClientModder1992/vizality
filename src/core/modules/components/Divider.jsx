const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = React.memo(props => {
  const { className } = props;
  delete props.className;

  const { dividerDefault } = getModule('dividerDefault');
  const { divider } = getModule(m => m.divider && Object.keys(m).length === 1);
  return <div className={joinClassNames(divider, dividerDefault, className)} {...props} />;
});
