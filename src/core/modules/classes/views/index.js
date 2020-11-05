const { getModule } = require('@vizality/webpack');

const views = {
  ...getModule('attachment'),
  ...getModule('members')
};

module.exports = views;
