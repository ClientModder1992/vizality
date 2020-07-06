const { getModule } = require('vizality/webpack');

module.exports = {
  plugins: {
    ...getModule([ 'attachment' ]),
    ...getModule([ 'members' ])
  }
};
