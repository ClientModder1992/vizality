module.exports = () => {
  const base = '000000';
  const number = Math.floor(Math.random() * 16777215).toString(16);
  return `#${(base + number).substr(-6)}`;
};
