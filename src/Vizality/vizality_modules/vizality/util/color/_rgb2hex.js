const _rgb2hex = (color) => {
  const ex = /^rgb\((((((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]),\s?)){2}|((((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5])\s)){2})((1?[1-9]?\d)|10\d|(2[0-4]\d)|25[0-5]))|((((([1-9]?\d(\.\d+)?)|100|(\.\d+))%,\s?){2}|((([1-9]?\d(\.\d+)?)|100|(\.\d+))%\s){2})(([1-9]?\d(\.\d+)?)|100|(\.\d+))%))\)$/i;

  if (ex.test(color)) {
    // choose correct separator
    const sep = color.indexOf(',') > -1 ? ',' : ' ';
    // turn 'rgb(r,g,b)', 'rgb(r, g, b)', and 'rgb(r g b)' into [r,g,b]
    color = color.substr(4).split(')')[0].split(sep);

    // convert %s to 0–255
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
};

module.exports = _rgb2hex;
