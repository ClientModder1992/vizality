const { getModule } = require('vizality/webpack');
const { attachments } = require('./attachments');

module.exports = {
  chat: {
    ...getModule([ 'pie' ]),
    ...getModule([ 'poop' ]),
    ...getModule([ 'chat' ]),
    attachments
  }
};
