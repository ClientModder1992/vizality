const _hsl2int = (color) => {
  const ex = /^hsl\(((((([12]?[1-9]?\d)|[12]0\d|(3[0-5]\d))(\.\d+)?)|(\.\d+))(deg)?|(0|0?\.\d+)turn|(([0-6](\.\d+)?)|(\.\d+))rad)((,\s?(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2}|(\s(([1-9]?\d(\.\d+)?)|100|(\.\d+))%){2})\)$/i;

  if (ex.test(color)) {
    const sep = color.indexOf(',') > -1 ? ',' : ' ';
    color = color.substr(4).split(')')[0].split(sep);

    let h = color[0];
    const s = color[1].substr(0, color[1].length - 1) / 100;
    const l = color[2].substr(0, color[2].length - 1) / 100;

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

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (r << 16) + (g << 16) + b;
  }
};

module.exports = _hsl2int;
