const { getModule } = require('vizality/webpack');

const components = {
  ...getModule('attachment'),
  ...getModule('members')
};

module.exports = components;
