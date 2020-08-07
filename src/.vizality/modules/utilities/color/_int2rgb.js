const _int2rgb = (color) => {
  return `rgb(${(color >> 16 & 255)} ${(color >> 8 & 255)} ${(255 & color)})`;
};

module.exports = _int2rgb;
