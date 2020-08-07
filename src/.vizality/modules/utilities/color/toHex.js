const { warn } = require('../logger');

const _int2hex = require('./_int2hex');
const _rgb2hex = require('./_rgb2hex');
const _hsl2hex = require('./_hsl2hex');
const getType = require('./getType');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
const toHex = (color) => {
  const module = 'Module';
  const submodule = 'Util:color:toHex';

  const colorType = getType(color);

  switch (colorType) {
    case 'hex':
      return color;
    case 'rgb':
      return _rgb2hex(color);
    case 'hsl':
      return _hsl2hex(color);
    case 'int':
      return _int2hex(color);
    default:
      return warn(module, submodule, null, `Input color '${color}' is not a recognized color type.`);
  }
};

module.exports = toHex;
