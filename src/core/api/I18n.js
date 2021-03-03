import { getModule } from '@vizality/webpack';
import { API } from '@vizality/entities';
import i18n from '@vizality/i18n';

import * as strings from '../languages';

let locale;
// getLocale
// setLocale
// getLanguage
// getLanguages
// getMessage
// getMessages
// getMessagesByString
// getMessagesByAddon
// getAllMessages
// registerMessage
// registerMessages
// unregisterMessage
// unregisterMessages
// getMessagesByLocale
export default class I18n extends API {
  constructor () {
    super();
    this.messages = {};
    this._vizality = strings;
    this.injectAllStrings(this._vizality);
    this._module = 'API';
    this._submodule = 'I18n';
  }

  _handleLocaleChange (diff) {
    if (diff.locale) {
      [ locale ] = diff;
      this._addVizalityStrings();
    }
  }

  async start () {
    locale = getModule('locale', 'theme')?.locale;
    console.log(locale);
    vizality.on('VIZALITY_DISCORD_SETTING_UPDATE', this._handleLocaleChange);
    this._addVizalityStrings();
  }

  stop () {
    /*
     * @todo There is a problem with plugins that override default strings.
     * This will remove those as well, causing blank strings and possibly crashes.
     * Need to store the original strings somewhere when overriding in order to revert
     * on stop. Maybe this._original?
     */
    // [ 'messages', 'defaultMessages' ].forEach(obj => {
    //   Object.keys(i18n._proxyContext[obj])
    //     .filter(key => Object.keys(this.messages[this.locale]).filter(k => k === key))
    //     .forEach(key => delete i18n._proxyContext[obj][key]);
    // });

    delete vizality.api.i18n;
    this.removeAllListeners();
  }

  getLocale () {
    try {
      return locale;
    } catch (err) {
      this.error(err);
    }
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
      this.injectStrings(locale, strings[locale]);
    });
  }

  injectStrings (locale, strings) {
    /**
     * @note Because you can't easily export modules with hyphens in them, this
     * accounts for plugins using require syntax and plugins using ESM syntax, and the
     * possibility that they may export without the hyphen.
     */
    const ogLocale = locale;
    locale = (/-/).test(locale) ? ogLocale : locale.replace(/([A-Z])/, '-$1').trim();
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
