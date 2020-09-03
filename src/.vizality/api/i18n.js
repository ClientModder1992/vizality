const { getModule, i18n } = require('@webpack');
const { DIR: { I18N_DIR } } = require('@constants');
const { API } = require('@entities');

const strings = require(I18N_DIR);

module.exports = class I18nAPI extends API {
  constructor () {
    super();
    this.messages = {};
    this.locale = null;
    this.loadAllStrings(strings);
  }

  async onStart () {
    await getModule('locale', 'theme', true).then(module => {
      this.locale = module.locale;
      module.addChangeListener(() => {
        if (module.locale !== this.locale) {
          this.locale = module.locale;
          i18n.loadPromise.then(() => this._addVizalityStrings());
        }
      });
      this._addVizalityStrings();
    });
  }

  _addVizalityStrings () {
    Object.assign(i18n._proxyContext.messages, this.messages[this.locale]);
    Object.assign(i18n._proxyContext.defaultMessages, this.messages['en-US']);
    /*
     * @todo: This removes the 'Hold up!' string, which is also used in the
     * mention everyone popout... Look for a fix, possibly patching into a
     * function call by DiscordNative that is fired when dev tools are opened.
     */
    delete i18n._proxyContext.messages.SELF_XSS_HEADER;
    delete i18n._proxyContext.defaultMessages.SELF_XSS_HEADER;
  }

  loadAllStrings (strings) {
    Object.keys(strings).forEach(locale => this.loadStrings(locale, strings[locale]));
  }

  loadStrings (locale, strings) {
    if (!this.messages[locale]) {
      this.messages[locale] = strings;
    } else {
      this.messages[locale] = {
        ...this.messages[locale],
        ...strings
      };
    }
    this._addVizalityStrings();
  }
};
