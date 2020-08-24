/* eslint-disable jsdoc/require-param *//* eslint-disable prefer-const */
const Logger = require('./Logger');

/**
 * @todo Add: isType, assertType, isHex, isHsl, isInt, isRgb, assertHex, assertHsl, assertInt, assertRgb
 * @todo Make these work with 8-digit hex numbers, rgba, and hsla.
 */

const _module = 'Module';
const _submodule = 'Util:Color';

/**
 * @module Util.Color
 * @namespace Util.Color
 * @memberof Util
 * @version 0.0.1
 */
module.exports = class Color {
  static _hex2hsl (color) {
    // Convert hex to RGB first
    let r, g, b;

    // 3 digits
    if (color.length === 4) {
      r = `0x${color[1]}${color[1]}`;
      g = `0x${color[2]}${color[2]}`;
      b = `0x${color[3]}${color[3]}`;

    // 6 digits
    } else if (color.length === 7) {
      r = `0x${color[1]}${color[2]}`;
      g = `0x${color[3]}${color[4]}`;
      b = `0x${color[5]}${color[6]}`;
    }

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h, s, l;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h} ${s}% ${l}%)`;
  }

  static _hex2int (color) {
    if (color.length === 4) {
      color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
    }

    return parseInt(color.slice(1), 16);
  }

  static _hex2rgb (color) {
    let r, g, b;

    // 3 digits
    if (color.length === 4) {
      r = `0x${color[1]}${color[1]}`;
      g = `0x${color[2]}${color[2]}`;
      b = `0x${color[3]}${color[3]}`;

    // 6 digits
    } else if (color.length === 7) {
      r = `0x${color[1]}${color[2]}`;
      g = `0x${color[3]}${color[4]}`;
      b = `0x${color[5]}${color[6]}`;
    }

    return `rgb(${+r} ${+g} ${+b})`;
  }

  static _hsl2hex (color) {
    const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      let h = color[0];
      let s = color[1].substr(0, color[1].length - 1) / 100;
      let l = color[2].substr(0, color[2].length - 1) / 100;

      // strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) {
        h = h.substr(0, h.length - 3);
      } else if (h.indexOf('rad') > -1) {
        h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
      } else if (h.indexOf('turn') > -1) {
        h = Math.round(h.substr(0, h.length - 4) * 360);
      }

      if (h >= 360) {
        h %= 360;
      }

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      // Having obtained RGB, convert channels to hex
      r = Math.round((r + m) * 255).toString(16);
      g = Math.round((g + m) * 255).toString(16);
      b = Math.round((b + m) * 255).toString(16);

      // Prepend 0s if necessary
      if (r.length === 1) {
        r = `0${r}`;
      }
      if (g.length === 1) {
        g = `0${g}`;
      }
      if (b.length === 1) {
        b = `0${b}`;
      }

      return `#${r}${g}${b}`;
    }
  }

  static _hsl2int (color) {
    const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      let h = color[0];
      const s = color[1].substr(0, color[1].length - 1) / 100;
      const l = color[2].substr(0, color[2].length - 1) / 100;

      // Strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) {
        h = h.substr(0, h.length - 3);
      } else if (h.indexOf('rad') > -1) {
        h = Math.round(h.substr(0, h.length - 3) * (180 / Math.PI));
      } else if (h.indexOf('turn') > -1) {
        h = Math.round(h.substr(0, h.length - 4) * 360);
      }

      if (h >= 360) {
        h %= 360;
      }

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return (r << 16) + (g << 16) + b;
    }
  }

  static _hsl2rgb (color) {
    const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      let h = color[0];
      let s = color[1].substr(0, color[1].length - 1) / 100;
      let l = color[2].substr(0, color[2].length - 1) / 100;

      // Strip label and convert to degrees (if necessary)
      if (h.indexOf('deg') > -1) {
        h = h.substr(0, h.length - 3);
      } else if (h.indexOf('rad') > -1) {
        h = Math.round(h.substr(0, h.length - 3) / (2 * Math.PI) * 360);
      } else if (h.indexOf('turn') > -1) {
        h = Math.round(h.substr(0, h.length - 4) * 360);
      }
      // Keep hue fraction of 360 if ending up over
      if (h >= 360) {
        h %= 360;
      }

      const c = (1 - Math.abs(2 * l - 1)) * s;
      const x = c * (1 - Math.abs((h / 60) % 2 - 1));
      const m = l - c / 2;

      let r, g, b;

      if (h >= 0 && h < 60) {
        r = c;
        g = x;
        b = 0;
      } else if (h >= 60 && h < 120) {
        r = x;
        g = c;
        b = 0;
      } else if (h >= 120 && h < 180) {
        r = 0;
        g = c;
        b = x;
      } else if (h >= 180 && h < 240) {
        r = 0;
        g = x;
        b = c;
      } else if (h >= 240 && h < 300) {
        r = x;
        g = 0;
        b = c;
      } else if (h >= 300 && h < 360) {
        r = c;
        g = 0;
        b = x;
      }

      r = Math.round((r + m) * 255);
      g = Math.round((g + m) * 255);
      b = Math.round((b + m) * 255);

      return `rgb(${+r} ${+g} ${+b})`;
    }
  }

  static _int2hex (color) {
    return `#${((color) >>> 0).toString(16)}`;
  }

  static _int2hsl (color) {
    // Convert int to hex first
    const hex = `#${((color) >>> 0).toString(16)}`;

    // Convert hex to RGB next
    let r = `0x${hex[1]}${hex[2]}`;
    let g = `0x${hex[3]}${hex[4]}`;
    let b = `0x${hex[5]}${hex[6]}`;

    // Then to HSL
    r /= 255;
    g /= 255;
    b /= 255;

    const cmin = Math.min(r, g, b);
    const cmax = Math.max(r, g, b);
    const delta = cmax - cmin;

    let h, s, l;

    if (delta === 0) h = 0;
    else if (cmax === r) h = ((g - b) / delta) % 6;
    else if (cmax === g) h = (b - r) / delta + 2;
    else h = (r - g) / delta + 4;

    h = Math.round(h * 60);

    if (h < 0) h += 360;

    l = (cmax + cmin) / 2;
    s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
    s = +(s * 100).toFixed(1);
    l = +(l * 100).toFixed(1);

    return `hsl(${h} ${s}% ${l}%)`;
  }

  static _int2rgb (color) {
    return `rgb(${(color >> 16 & 255)} ${(color >> 8 & 255)} ${(255 & color)})`;
  }

  static _rgb2hex (color) {
    const ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

    if (ex.test(color)) {
      // Choose correct separator
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      // Turn 'rgb(r,g,b)', 'rgb(r, g, b)', and 'rgb(r g b)' formats into [r,g,b]
      color = color.substr(4).split(')')[0].split(sep);

      // Convert %s to 0–255
      for (const R in color) {
        const r = color[R];
        if (r.indexOf('%') > -1) {
          color[R] = Math.round(r.substr(0, r.length - 1) / 100 * 255);
        }
        /*
         * Example:
         * 75% -> 191
         * 75/100 = 0.75, * 255 = 191.25 -> 191
         */
      }

      let r = (+color[0]).toString(16);
      let g = (+color[1]).toString(16);
      let b = (+color[2]).toString(16);

      if (r.length === 1) r = `0${r}`;
      if (g.length === 1) g = `0${g}`;
      if (b.length === 1) b = `0${b}`;

      return `#${r}${g}${b}`;
    }
  }

  static _rgb2hsl (color) {
    const ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

    if (ex.test(color)) {
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      color = color.substr(4).split(')')[0].split(sep);

      // Convert %s to 0–255
      for (const R in color) {
        const r = color[R];
        if (r.indexOf('%') > -1) {
          color[R] = Math.round(r.substr(0, r.length - 1) / 100 * 255);
        }
      }

      // Make r, g, and b fractions of 1
      const r = color[0] / 255;
      const g = color[1] / 255;
      const b = color[2] / 255;

      // Find greatest and smallest channel values
      const cmin = Math.min(r, g, b);
      const cmax = Math.max(r, g, b);
      const delta = cmax - cmin;

      let h, s, l;

      // Calculate hue

      // No difference
      if (delta === 0) h = 0;
      // Red is max
      else if (cmax === r) h = ((g - b) / delta) % 6;
      // Green is max
      else if (cmax === g) h = (b - r) / delta + 2;
      // Blue is max
      else h = (r - g) / delta + 4;

      h = Math.round(h * 60);

      // Make negative hues positive behind 360°
      if (h < 0) {
        h += 360;
      }

      // Calculate lightness
      l = (cmax + cmin) / 2;

      // Calculate saturation
      s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

      // Multiply l and s by 100
      s = +(s * 100).toFixed(1);
      l = +(l * 100).toFixed(1);

      return `hsl(${h} ${s}% ${l}%)`;
    }
  }

  static _rgb2int (color) {
    const ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

    if (ex.test(color)) {
      // Choose correct separator
      const sep = color.indexOf(',') > -1 ? ',' : ' ';
      // Turn 'rgb(r,g,b)', 'rgb(r, g, b)', and 'rgb(r g b)' format into [r,g,b]
      color = color.substr(4).split(')')[0].split(sep);

      // Convert %s to 0–255
      for (const R in color) {
        const r = color[R];
        if (r.indexOf('%') > -1) {
          color[R] = Math.round(r.substr(0, r.length - 1) / 100 * 255);
        }
        /*
         * Example:
         * 75% -> 191
         * 75/100 = 0.75, * 255 = 191.25 -> 191
         */
      }

      const r = (+color[0]).toString(16);
      const g = (+color[1]).toString(16);
      const b = (+color[2]).toString(16);

      return (r << 16) + (g << 16) + b;
    }
  }

  static getContrastedColor (color) {
    let r, g, b;

    /** @private */
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

    _hex(this.toHex(color));

    if ((r * 0.299) + (g * 0.587) + (b * 0.114) > 186) return '#000';

    return '#fff';
  }

  static getRandomColor (type = 'hex') {
    // @todo Assert color type

    const base = '000000';
    const number = Math.floor(Math.random() * 16777215).toString(16);
    const color = `#${(base + number).substr(-6)}`;

    if (type === 'int') return this._hex2int(color);
    if (type === 'hex') return color;
    if (type === 'rgb') return this._hex2rgb(color);
    if (type === 'hsl') return this._hex2hsl(color);
  }

  static getType (color) {
    // @todo Assert string

    const ex = {
      hex: /^#([\da-f]{3}){1,2}$/i,

      rgb: /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i,

      hsl: /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i
    };

    if (ex.rgb.test(color)) { return 'rgb'; }
    if (ex.hex.test(color)) { return 'hex'; }
    if (ex.hsl.test(color)) { return 'hsl'; }
    if (Number.isInteger(parseInt(color))) { return 'int'; }

    // @todo Proper error message
    return Logger.error(_module, `${_submodule}:getType`, null, 'Color type is not valid. Valid types are "hex", "int", "rgb", and "hsl".');
  }

  static toHex (color) {
    const type = this.getType(color);

    if (type === 'int') return this._int2hex(color);
    if (type === 'hex') return color;
    if (type === 'rgb') return this._rgb2hex(color);
    if (type === 'hsl') return this._hsl2hex(color);
  }

  static toHsl (color) {
    const type = this.getType(color);

    if (type === 'int') return this._int2hsl(color);
    if (type === 'hex') return this._hex2hsl(color);
    if (type === 'rgb') return this._rgb2hsl(color);
    if (type === 'hsl') return color;
  }

  static toInt (color) {
    const type = this.getType(color);

    if (type === 'int') return this._hex2int(color);
    if (type === 'hex') return this._hex2int(color);
    if (type === 'rgb') return this._rgb2int(color);
    if (type === 'hsl') return this._hsl2int(color);
  }

  static toRgb (color) {
    const type = this.getType(color);

    if (type === 'int') return this._int2rgb(color);
    if (type === 'hex') return this._hex2rgb(color);
    if (type === 'rgb') return color;
    if (type === 'hsl') return this._hsl2rgb(color);
  }
};
