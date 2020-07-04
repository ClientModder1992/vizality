const { getModule } = require('vizality/webpack');

module.exports = {
  attachments: {
    ...getModule([ 'attachment' ], false),
    ...getModule([ 'members' ], false)
  }
};
