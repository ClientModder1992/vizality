const { getModule } = require('vizality/webpack');

const attachments = {
  ...getModule('attachment'),
  ...getModule('members')
};

module.exports = attachments;
