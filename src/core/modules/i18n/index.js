const { getModule } = require('../webpack');

module.exports = {
  ...getModule('Messages', 'languages')
};
