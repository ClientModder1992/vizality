import { getModule, i18n } from '@vizality/webpack';
import { Directories } from '@vizality/constants';
import { API } from '@vizality/core';

export default class I18nAPI extends API {
  constructor () {
    super();
    this.messages = {};
    this.locale = null;

    (async () => {
      this.strings = await import(Directories.LANGUAGES);
      this.injectAllStrings(this.strings);
    })();
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
     * @todo This removes the 'Hold up!' string, which is also used in the
     * mention everyone popout. Look for a fix, possibly patching into a
     * function call by DiscordNative that is fired when dev tools are opened.
     */
    [ 'messages', 'defaultMessages' ].forEach(obj => {
      Object.keys(i18n._proxyContext[obj])
        .filter(key => key.startsWith('SELF_XSS'))
        .forEach(key => delete i18n._proxyContext[obj][key]);
    });
  }

  injectAllStrings (strings) {
    Object.keys(strings).forEach(locale => {
      const ogLocale = locale;
      locale = (/-/).test(locale) ? ogLocale : locale.replace(/([A-Z])/, '-$1').trim();
      this.injectStrings(locale, strings[ogLocale]);
    });
  }

  injectStrings (locale, strings) {
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
}
