const { getModule } = require('vizality/webpack');

module.exports = {
  components: {
    ...getModule([ 'attachment' ], false),
    ...getModule([ 'members' ], false)
  }
};
