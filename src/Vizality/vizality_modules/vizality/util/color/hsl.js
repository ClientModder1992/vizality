const logger = require('../logger');

const int2hsl = require('./int2hsl');
const hex2hsl = require('./hex2hsl');
const rgb2hsl = require('./rgb2hsl');
const type = require('./type');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
module.exports = (color) => {
  const colorType = type(color);

  switch (colorType) {
    case 'hsl':
      return color;
    case 'hex':
      return hex2hsl(color);
    case 'rgb':
      return rgb2hsl(color);
    case 'int':
      return int2hsl(color);
    default:
      logger.warn('Module', 'Util:color:hsl', null, `Input color '${color}' is not a recognized color type.`);
  }
};
