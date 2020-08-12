let stripDiacriticsModule;

const stripDiacritics = (string) => {
  if (!stripDiacriticsModule) stripDiacriticsModule = require('@webpack').getModule('stripDiacritics').stripDiacritics;

  return stripDiacriticsModule(string);
};

module.exports = stripDiacritics;
