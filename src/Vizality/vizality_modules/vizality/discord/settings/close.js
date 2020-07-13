const { getModule } = require('vizality/webpack');

const close = () => {
  const { popLayer } = getModule('popLayer');

  return popLayer();
};

module.exports = close;
