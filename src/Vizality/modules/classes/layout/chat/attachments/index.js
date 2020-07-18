const { getModule } = require('@webpack');

const poo = require('./poo');

const attachments = {
  ...getModule('attachment'),
  ...getModule('members'),
  iconasd: 'icon-man',
  poo
};

module.exports = attachments;
