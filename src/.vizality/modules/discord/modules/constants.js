const { getModule } = require('@webpack');

const constants = {
  ...getModule('Permissions', 'ActivityTypes', 'StatusTypes')
};

module.exports = constants;
