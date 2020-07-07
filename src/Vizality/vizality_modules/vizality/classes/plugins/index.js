const { getModule } = require('vizality/webpack');

const plugins = {
  ...getModule('attachment'),
  ...getModule('members')
};

module.exports = plugins;
