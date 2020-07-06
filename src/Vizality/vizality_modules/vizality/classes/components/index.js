const { getModule } = require('vizality/webpack');

module.exports = {
  components: {
    ...getModule([ 'attachment' ]),
    ...getModule([ 'members' ])
  }
};
