const { getModule } = require('vizality/webpack');

module.exports = {
  attachments: {
    ...getModule([ 'attachment' ]),
    ...getModule([ 'members' ])
  }
};
