/* eslint-disable prefer-arrow-callback */
const { joinClassNames } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');
const { React } = require('@vizality/react');

module.exports = React.memo(function VizalityDivider () {
  const { dividerDefault } = getModule('dividerDefault');
  const { divider } = getModule(m => m.divider && Object.keys(m).length === 1);
  return <div className={joinClassNames('vz-divider', divider, dividerDefault)} />;
});
