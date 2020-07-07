const { getModule } = require('vizality/webpack');
const { attachments } = require('./attachments');

const chat = {
  ...getModule('pie'),
  ...getModule('poop'),
  ...getModule('chat'),
  attachments
};

module.exports = chat;
