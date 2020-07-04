const { getModule } = require('vizality/webpack');

module.exports = {
  plugins: {
    ...getModule([ 'attachment' ], false),
    ...getModule([ 'members' ], false)
  }
};
