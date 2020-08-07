const _int2hex = (color) => {
  return `#${((color) >>> 0).toString(16)}`;
};

module.exports = _int2hex;
