const { Plugin } = require('@entities');

const i18n = require('./i18n');

module.exports = class BringBackGamerTexts extends Plugin {
  onStart () {
    vizality.api.i18n.loadAllStrings(i18n);
  }
};
