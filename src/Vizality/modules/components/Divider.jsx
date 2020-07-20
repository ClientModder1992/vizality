const { React, getModule } = require('@webpack');

const AsyncComponent = require('./AsyncComponent');

const Divider = AsyncComponent.from((() => {
  const { dividerDefault } = getModule('dividerDefault');
  const { divider } = getModule(m => m.divider && Object.keys(m).length === 1);
  return () => <div className={`${divider} ${dividerDefault}`}/>;
})());

module.exports = Divider;
