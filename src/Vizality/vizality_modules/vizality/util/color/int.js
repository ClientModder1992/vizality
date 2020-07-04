const logger = require('../logger');

const hex2int = require('./hex2int');
const rgb2int = require('./rgb2int');
const hsl2int = require('./hsl2int');
const type = require('./type');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
module.exports = (color) => {
  const colorType = type(color);

  switch (colorType) {
    case 'int':
      return color;
    case 'hex':
      return hex2int(color);
    case 'rgb':
      return rgb2int(color);
    case 'hsl':
      return hsl2int(color);
    default:
      logger.warn('Module', 'Util:color:hsl', null, `Input color '${color}' is not a recognized color type.`);
  }
};
