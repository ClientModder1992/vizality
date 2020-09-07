const { joinClassNames } = require('@util');
const { getModule } = require('@webpack');
const { React } = require('@react');

module.exports = React.memo(() => {
  const { dividerDefault } = getModule('dividerDefault');
  const { divider } = getModule(m => m.divider && Object.keys(m).length === 1);
  return () => <div className={joinClassNames(divider, dividerDefault)} />;
});
