const logger = require('../logger');

const _int2rgb = require('./_int2rgb');
const _hex2rgb = require('./_hex2rgb');
const _hsl2rgb = require('./_hsl2rgb');
const getType = require('./getType');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
const toRgb = (color) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:color:toRgb';

  const colorType = getType(color);

  switch (colorType) {
    case 'rgb':
      return color;
    case 'hex':
      return _hex2rgb(color);
    case 'hsl':
      return _hsl2rgb(color);
    case 'int':
      return _int2rgb(color);
    default:
      return logger.warn(MODULE, SUBMODULE, null, `Input color '${color}' is not a recognized color type.`);
  }
};

module.exports = toRgb;
