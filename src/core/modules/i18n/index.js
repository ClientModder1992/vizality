/* eslint-disable no-unused-vars */

const { getModule } = require('../webpack');

module.exports = {
  ...getModule('Messages', 'languages')
};
