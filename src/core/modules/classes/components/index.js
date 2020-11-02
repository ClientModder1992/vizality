const { getModule } = require('@webpack');

const components = {
  ...getModule('attachment'),
  ...getModule('members'),
  hunk: getModule('members').hunk
};

module.exports = components;
