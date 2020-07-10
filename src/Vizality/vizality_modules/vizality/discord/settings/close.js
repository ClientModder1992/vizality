const { getModule } = require('vizality/webpack');

const close = () => {
  const popLayer = getModule('popLayer');

  return popLayer.popAllLayers();
};

module.exports = close;
