const toPascalCase = (string) => {
  if (!string) return '';

  return String(string)
    .replace(/^[^A-Za-z0-9]*|[^A-Za-z0-9]*$/g, '$')
    .replace(/[^A-Za-z0-9]+/g, '$')
    .replace(/([a-z])([A-Z])/g, (m, a, b) => {
      return `${a}$${b}`;
    })
    .toLowerCase().trim()
    .replace(/(\$)(\w?)/g, (m, a, b) => {
      return b.toUpperCase();
    });
};

module.exports = toPascalCase;
