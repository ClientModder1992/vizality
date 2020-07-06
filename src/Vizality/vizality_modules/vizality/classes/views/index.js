const { getModule } = require('vizality/webpack');

module.exports = {
  views: {
    ...getModule([ 'attachment' ]),
    ...getModule([ 'members' ])
  }
};
