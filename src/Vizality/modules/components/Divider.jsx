const { React, getModule } = require('vizality/webpack');
const AsyncComponent = require('./AsyncComponent');

module.exports = AsyncComponent.from((() => {
  const { dividerDefault } = getModule('dividerDefault');
  const { divider } = getModule(m => m.divider && Object.keys(m).length === 1);
  return () => <div className={`${divider} ${dividerDefault}`}/>;
})());
