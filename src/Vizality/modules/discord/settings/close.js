const { getModule } = require('@webpack');

const close = () => {
  const { popLayer } = getModule('popLayer');

  return popLayer();
};

module.exports = close;
