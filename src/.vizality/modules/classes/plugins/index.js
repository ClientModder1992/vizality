const Webpack = require('@webpack');

const plugins = {
  ...Webpack.getModule('attachment'),
  ...Webpack.getModule('members'),
  test: 'iconActiveLarge-2nzn9z',
  test2: 'iconActiveMedium-1UaEIR',
  test3: 'iconActiveMini-3PzjMn',
  test4: 'iconActiveSmall-3IUUtn',
  test5: 'iconActiveXLarge-_qKvKn',
  test6: 'iconInactive-98JN5i'
};

module.exports = plugins;
