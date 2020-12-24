const { getModule } = require('../webpack');

const i18n = {
  ...getModule('Messages', 'languages')
};

module.exports = {
  ...i18n
};
