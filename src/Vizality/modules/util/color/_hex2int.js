const _hex2int = (color) => {
  if (color.length === 4) {
    color = `#${color[1]}${color[1]}${color[2]}${color[2]}${color[3]}${color[3]}`;
  }

  return parseInt(color.slice(1), 16);
};

module.exports = _hex2int;
