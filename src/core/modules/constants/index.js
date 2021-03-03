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
  // --- Vizality Settings
  VIZALITY_INITIALIZE: 'VIZALITY_INITIALIZE',
  VIZALITY_SETTINGS_READY: 'VIZALITY_SETTINGS_READY',
  VIZALITY_SETTING_UPDATE: 'VIZALITY_SETTING_UPDATE',
  VIZALITY_SETTING_TOGGLE: 'VIZALITY_SETTING_TOGGLE',

  // --- Vizality Addon Settings
  VIZALITY_ADDON_SETTINGS_REGISTER: 'VIZALITY_ADDON_SETTINGS_REGISTER',
  VIZALITY_ADDON_SETTINGS_UNREGISTER: 'VIZALITY_ADDON_SETTINGS_UNREGISTER',
  VIZALITY_ADDON_SETTING_UPDATE: 'VIZALITY_ADDON_SETTING_UPDATE',
  VIZALITY_ADDON_SETTING_TOGGLE: 'VIZALITY_ADDON_SETTING_TOGGLE',

  // --- Vizality APIs
  VIZALITY_ACTION_ADD: 'VIZALITY_ACTION_ADD',
  VIZALITY_ACTION_REMOVE: 'VIZALITY_ACTION_REMOVE',
  VIZALITY_ACTION_INVOKE: 'VIZALITY_ACTION_INVOKE',
  VIZALITY_ACTION_REMOVE_ALL: 'VIZALITY_ACTION_REMOVE_ALL',
  VIZALITY_ACTION_REMOVE_ALL_BY_CALLER: 'VIZALITY_ACTION_REMOVE_ALL_BY_CALLER',
  VIZALITY_POPUP_WINDOW_OPEN: 'VIZALITY_POPUP_WINDOW_OPEN',
  VIZALITY_POPUP_WINDOW_CLOSE: 'VIZALITY_POPUP_WINDOW_CLOSE',

  // --- Discord
  USER_SETTINGS_UPDATE: 'USER_SETTINGS_UPDATE'
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

export const ActionTypes = Object.freeze({
  USER_SETTINGS_UPDATE: 'USER_SETTINGS_UPDATE',
  I18N_LOAD_SUCCESS: 'I18N_LOAD_SUCCESS'
});

export const IpcChannels = Object.freeze({
  VIZALITY_WINDOW_UNMAXIMIZE: 'VIZALITY_WINDOW_UNMAXIMIZE',
  VIZALITY_WINDOW_MAXIMIZE: 'VIZALITY_WINDOW_MAXIMIZE',
  VIZALITY_WINDOW_IS_MAXIMIZED: 'VIZALITY_WINDOW_IS_MAXIMIZED'
});

export const ErrorTypes = Object.freeze({

});

export const Developers = Object.freeze([
  '97549189629636608', // dperolio
  '301494563514613762', // Sebastian
  '415849376598982656' // Strencher
]);
