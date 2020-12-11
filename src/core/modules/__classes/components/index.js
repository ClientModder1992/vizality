const { getModule } = require('@vizality/webpack');

const components = {
  ...getModule('attachment'),
  ...getModule('members'),
  hunk: getModule('members').hunk
};

module.exports = components;
