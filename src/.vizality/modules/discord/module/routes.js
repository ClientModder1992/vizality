const { getModule } = require('@webpack');

const routes = {
  ...getModule('Routes').Routes
};

module.exports = routes;
