const toSentenceCase = (string) => {
  if (!string) return '';

  const textcase = String(string)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => {
      return `${a}_${b.toLowerCase()}`;
    })
    .replace(/[^A-Za-z0-9]+|_+/g, ' ')
    .toLowerCase().trim();

  return textcase.charAt(0).toUpperCase() + textcase.slice(1);
};

module.exports = toSentenceCase;
