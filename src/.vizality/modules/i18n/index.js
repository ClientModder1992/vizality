/* eslint-disable no-unused-vars */

const { getModule } = require('../webpack');

const i18n = module.exports = {
  ...getModule('Messages', 'languages')
};
