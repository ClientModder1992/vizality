const { warn } = require('../logger');

const _hex2int = require('./_hex2int');
const _hex2rgb = require('./_hex2rgb');
const _hex2hsl = require('./_hex2hsl');

const getRandom = (type) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:color:getRandom';

  if (!type) type = 'hex';

  type = String(type);

  const base = '000000';
  const number = Math.floor(Math.random() * 16777215).toString(16);
  const color = `#${(base + number).substr(-6)}`;

  switch (type) {
    case 'hex':
      return color;
    case 'rgb':
      return _hex2rgb(color);
    case 'hsl':
      return _hex2hsl(color);
    case 'int':
      return _hex2int(color);
    default:
      return warn(MODULE, SUBMODULE, null, `Input type '${type}' is not a valid color type. Please choose 'hex', 'rgb', 'hsl', or 'int'.`);
  }
};

module.exports = getRandom;
