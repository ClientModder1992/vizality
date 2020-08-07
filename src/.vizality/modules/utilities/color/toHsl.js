const { warn } = require('../logger');

const _int2hsl = require('./_int2hsl');
const _hex2hsl = require('./_hex2hsl');
const _rgb2hsl = require('./_rgb2hsl');
const getType = require('./getType');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
const toHsl = (color) => {
  const module = 'Module';
  const submodule = 'Util:color:toHsl';

  const colorType = getType(color);

  switch (colorType) {
    case 'hsl':
      return color;
    case 'hex':
      return _hex2hsl(color);
    case 'rgb':
      return _rgb2hsl(color);
    case 'int':
      return _int2hsl(color);
    default:
      return warn(module, submodule, null, `Input color '${color}' is not a recognized color type.`);
  }
};

module.exports = toHsl;
