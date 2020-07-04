const { getModule } = require('vizality/webpack');

module.exports = {
  views: {
    ...getModule([ 'attachment' ], false),
    ...getModule([ 'members' ], false)
  }
};
