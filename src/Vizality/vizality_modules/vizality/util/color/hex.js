const logger = require('../logger');

const int2hex = require('./int2hex');
const rgb2hex = require('./rgb2hex');
const hsl2hex = require('./hsl2hex');
const type = require('./type');

/**
 * @todo: Make this work with 8-digit hex numbers, rgba, and hsla.
 */
module.exports = (color) => {
  const colorType = type(color);

  switch (colorType) {
    case 'hex':
      return color;
    case 'rgb':
      return rgb2hex(color);
    case 'hsl':
      return hsl2hex(color);
    case 'int':
      return int2hex(color);
    default:
      logger.warn('Module', 'Util:color:hex', null, `Input color '${color}' is not a recognized color type.`);
  }
};
