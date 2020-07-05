const { warn } = require('../logger');

const getType = (color) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Util:color:getType';

  const ex = {
    hex: /^#([\da-f]{3}){1,2}$/i,

    rgb: /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i,

    hsl: /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i
  };

  if (ex.rgb.test(color)) {
    return 'rgb';
  } else if (ex.hex.test(color)) {
    return 'hex';
  } else if (ex.hsl.test(color)) {
    return 'hsl';
  } else if (Number.isInteger(parseInt(color))) {
    return 'int';
  }

  return warn(MODULE, SUBMODULE, null, `Input color '${color}' is not a recognized color type.`);
};

module.exports = getType;
