const { getModule } = require('@webpack');

const views = {
  ...getModule('attachment'),
  ...getModule('members')
};

module.exports = views;
