const rgb2hex = require('./rgb2hex');
const hsl2hex = require('./hsl2hex');
const int2hex = require('./int2hex');

module.exports = (color) => {
  const ex = {
    hex: /^#([\da-f]{3}){1,2}$/i,

    rgb: /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i,

    hsl: /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i
  };

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

  if (ex.rgb.test(color)) {
    _hex(rgb2hex(color));
  } else if (ex.hex.test(color)) {
    _hex(color);
  } else if (ex.hsl.test(color)) {
    _hex(hsl2hex(color));
  } else if (Number.isInteger(color)) {
    _hex(int2hex(color));
  } else {
    throw new Error('Invalid color type entered.');
  }

  if ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186) return '#000';

  return '#fff';
};
