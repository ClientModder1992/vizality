const Webpack = require('@webpack');

const AsyncComponent = require('./AsyncComponent');

const Divider = AsyncComponent.from((() => {
  const { dividerDefault } = Webpack.getModule('dividerDefault');
  const { divider } = Webpack.getModule(m => m.divider && Object.keys(m).length === 1);
  return () => <div className={`${divider} ${dividerDefault}`}/>;
})());

module.exports = Divider;
