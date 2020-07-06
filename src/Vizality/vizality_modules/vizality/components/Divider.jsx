const { React, getModule } = require('vizality/webpack');
const AsyncComponent = require('./AsyncComponent');

module.exports = AsyncComponent.from((async () => {
  const { dividerDefault } = await getModule([ 'dividerDefault' ], true);
  const { divider } = await getModule(m => m.divider && Object.keys(m).length === 1, true);
  return () => <div className={`${divider} ${dividerDefault}`}/>;
})());
