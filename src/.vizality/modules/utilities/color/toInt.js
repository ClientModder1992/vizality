const { warn } = require('../logger');

const _hex2int = require('./_hex2int');
const _rgb2int = require('./_rgb2int');
const _hsl2int = require('./_hsl2int');
const getType = require('./getType');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
const toInt = (color) => {
  const module = 'Module';
  const submodule = 'Util:color:toInt';

  const colorType = getType(color);

  switch (colorType) {
    case 'int':
      return color;
    case 'hex':
      return _hex2int(color);
    case 'rgb':
      return _rgb2int(color);
    case 'hsl':
      return _hsl2int(color);
    default:
      return warn(module, submodule, null, `Input color '${color}' is not a recognized color type.`);
  }
};

module.exports = toInt;
