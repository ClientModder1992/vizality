const toPathCase = (string) => {
  if (!string) return '';

  return String(string)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => {
      return `${a}_${b.toLowerCase()}`;
    })
    .replace(/[^A-Za-z0-9]+|_+/g, '/')
    .toLowerCase().trim();
};

module.exports = toPathCase;
