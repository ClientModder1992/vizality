const { Plugin } = require('@entities');

const i18n = require('./i18n');

class BringBackGamerTexts extends Plugin {
  onStart () {
    vizality.api.i18n.loadAllStrings(i18n);
  }
}

module.exports = BringBackGamerTexts;
