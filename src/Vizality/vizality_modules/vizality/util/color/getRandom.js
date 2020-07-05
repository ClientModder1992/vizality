const logger = require('../logger');

const _int2hex = require('./_int2hex');
const _rgb2hex = require('./_rgb2hex');
const _hsl2hex = require('./_hsl2hex');

const getRandom = (type) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:color:getRandom';

  if (!type) type = 'hex';

  String(type);

  const base = '000000';
  const number = Math.floor(Math.random() * 16777215).toString(16);
  const color = `#${(base + number).substr(-6)}`;

  switch (type) {
    case 'hex':
      return color;
    case 'rgb':
      return _rgb2hex(color);
    case 'hsl':
      return _hsl2hex(color);
    case 'int':
      return _int2hex(color);
    default:
      return logger.warn(MODULE, SUBMODULE, null, `Input type '${type}' is not a valid color type. Please choose 'hex', 'rgb', 'hsl', or 'int'.`);
  }
};

module.exports = getRandom;
