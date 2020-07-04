module.exports = (color) => {
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
};
