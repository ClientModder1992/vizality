import { readdirSync } from 'fs';
import { join } from 'path';

export const HTTP = Object.freeze({
  CDN: 'https://cdn.vizality.com',
  WEBSITE: 'https://vizality.com',
  TRELLO: 'https://trello.com/vizality',
  get API () { return `${this.WEBSITE}/api`; },
  get DOCS () { return `${this.WEBSITE}/docs`; },
  get ASSETS () { return `${this.CDN}/assets`; }
});

export const Repositories = Object.freeze({
  ORG: 'vizality',
  get VIZALITY () { return `${this.ORG}/vizality`; },
  get COMMUNITY () { return `${this.ORG}/community`; }
});

export const Directories = Object.freeze({
  ROOT: join(__dirname, '..', '..', '..', '..'),
  get SRC () { return join(this.ROOT, 'src'); },
  get VIZALITY () { return join(this.SRC, 'core'); },
  get ASSETS () { return join(this.SRC, 'core', 'assets'); },
  // ---
  get SETTINGS () { return join(this.ROOT, 'settings'); },
  get CACHE () { return join(this.ROOT, '.cache'); },
  get LOGS () { return join(this.ROOT, '.logs'); },
  // ---
  get ADDONS () { return join(this.ROOT, 'addons'); },
  get PLUGINS () { return join(this.ADDONS, 'plugins'); },
  get BUILTINS () { return join(this.VIZALITY, 'builtins'); },
  get THEMES () { return join(this.ADDONS, 'themes'); },
  // ---
  get API () { return join(this.VIZALITY, 'api'); },
  get LIB () { return join(this.VIZALITY, 'lib'); },
  get LANGUAGES () { return join(this.VIZALITY, 'languages'); },
  get MANAGERS () { return join(this.VIZALITY, 'managers'); },
  get STYLES () { return join(this.VIZALITY, 'styles'); },
  get MODULES () { return join(__dirname, '..'); }
});

export const Vizality = Object.freeze({
  get BUILTINS () {
    const builtins = [];
    readdirSync(Directories.BUILTINS).forEach(file => builtins.push(file));
    return builtins;
  }
});

export const Guild = Object.freeze({
  INVITE: 'Fvmsfv2',
  ID: '689933814864150552'
});

export const Channels = Object.freeze({
  CSS_SNIPPETS: '705262981214371902',
  JS_SNIPPETS: '705262981214371902',
  PLUGINS: '700461738004578334',
  THEMES: '700461710972157954',
  DEVELOPMENT: '690452269753171998',
  STAFF: '690452551233175602',
  INSTALLATION_SUPPORT: '718478897695424613',
  PLUGINS_SUPPORT: '705264484528291956',
  THEMES_SUPPORT: '705264431831187496',
  MISC_SUPPORT: '705264513728905266'
});

// @todo These need proper testing and more added.
export const Regexes = Object.freeze({
  DISCORD: '^(https?://)?(canary.|ptb.)?discord(?:app)?.com',
  get INVITE () { return `${this.DISCORD}/invite|.gg)/[a-zA-Z1-9]{2,}`; },
  // eslint-disable-next-line no-useless-escape
  get MESSAGE_LINK () { return `${this.DISCORD}/channels/(?:@me|\d{17,19}/)?\d{17,19}/\d{17,19}`; },
  get ASSET_LINK () { return `(?:${this.DISCORD})?/assets/(?:[0-9].)?[a-zA-Z0-9]{20,32}.?[a-z]{2,5}`; },
  // eslint-disable-next-line no-useless-escape
  EMOJI: '(:|<:|<a:)((\w{1,64}:\d{17,18})|(\w{1,64}))(:|>)',
  USER_ID: '^(\\d{17,19})$',
  USER_MENTION: '^<@!?(\\d+)>$',
  CHANNEL_MENTION: '^<#!?(\\d+)>$'
});

export const Events = Object.freeze({
  VIZALITY_POPUP_WINDOW_OPEN: 'popupWindowOpen',
  VIZALITY_POPUP_WINDOW_CLOSE: 'popupWindowClose',
  // ---
  VIZALITY_INITIALIZE: 'initialize',
  VIZALITY_SETTINGS_READY: 'settingsReady',
  VIZALITY_SETTING_UPDATE: 'settingUpdate',
  VIZALITY_SETTING_TOGGLE: 'settingToggle',
  // ---
  VIZALITY_ADDON_SETTINGS_REGISTER: 'addonSettingsRegister',
  VIZALITY_ADDON_SETTINGS_UNREGISTER: 'addonSettingsUnregister',
  VIZALITY_ADDON_SETTING_UPDATE: 'addonSettingUpdate',
  VIZALITY_ADDON_SETTING_TOGGLE: 'addonSettingToggle',

  VIZALITY_ACTION_ADD: 'actionAdd',
  VIZALITY_ACTION_REMOVE: 'actionRemove',
  VIZALITY_ACTION_INVOKE: 'actionInvoke',
  VIZALITY_ACTION_REMOVE_ALL: 'actionRemoveAll',
  VIZALITY_ACTION_REMOVE_ALL_BY_CALLER: 'actionRemoveAllByCaller'
});

export const Avatars = Object.freeze({
  get DEFAULT_THEME_1 () { return 'vz-asset://image/default-theme-1.png'; },
  get DEFAULT_THEME_2 () { return 'vz-asset://image/default-theme-2.png'; },
  get DEFAULT_THEME_3 () { return 'vz-asset://image/default-theme-3.png'; },
  get DEFAULT_THEME_4 () { return 'vz-asset://image/default-theme-4.png'; },
  get DEFAULT_THEME_5 () { return 'vz-asset://image/default-theme-5.png'; },
  // ---
  get DEFAULT_PLUGIN_1 () { return 'vz-asset://image/default-plugin-1.png'; },
  get DEFAULT_PLUGIN_2 () { return 'vz-asset://image/default-plugin-2.png'; },
  get DEFAULT_PLUGIN_3 () { return 'vz-asset://image/default-plugin-3.png'; },
  get DEFAULT_PLUGIN_4 () { return 'vz-asset://image/default-plugin-4.png'; },
  get DEFAULT_PLUGIN_5 () { return 'vz-asset://image/default-plugin-5.png'; }
});

export const ErrorTypes = Object.freeze({

});

export const Developers = Object.freeze([
  '97549189629636608', // dperolio
  '301494563514613762', // Sebastian
  '415849376598982656' // Strencher
]);
