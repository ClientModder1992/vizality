const { getModule } = require('vizality/webpack');
const { attachments } = require('./attachments');

module.exports = {
  chat: {
    ...getModule([ 'pie' ], false),
    ...getModule([ 'poop' ], false),
    ...getModule([ 'chat' ], false),
    attachments
  }
};
