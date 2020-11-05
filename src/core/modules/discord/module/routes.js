const { getModule } = require('@vizality/webpack');

const routes = {
  ...getModule('Routes').Routes
};

module.exports = routes;
