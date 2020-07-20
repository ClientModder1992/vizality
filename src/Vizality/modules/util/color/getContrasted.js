const toHex = require('./toHex');

const getContrasted = (color) => {
  let r, g, b;

  function _hex (arg) {
    if (arg.length === 4) {
      r = `0x${arg[1]}${arg[1]}`;
      g = `0x${arg[2]}${arg[2]}`;
      b = `0x${arg[3]}${arg[3]}`;
    // 6 digits
    } else if (arg.length === 7) {
      r = `0x${arg[1]}${arg[2]}`;
      g = `0x${arg[3]}${arg[4]}`;
      b = `0x${arg[5]}${arg[6]}`;
    }
  }

  _hex(toHex(color));

  if ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186) return '#000';

  return '#fff';
};

module.exports = getContrasted;
