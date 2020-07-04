const logger = require('../logger');

const int2rgb = require('./int2rgb');
const hex2rgb = require('./hex2rgb');
const hsl2rgb = require('./hsl2rgb');
const type = require('./type');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
module.exports = (color) => {
  const colorType = type(color);

  switch (colorType) {
    case 'rgb':
      return color;
    case 'hex':
      return hex2rgb(color);
    case 'hsl':
      return hsl2rgb(color);
    case 'int':
      return int2rgb(color);
    default:
      logger.warn('Module', 'Util:color:hsl', null, `Input color '${color}' is not a recognized color type.`);
  }
};
