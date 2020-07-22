const { join } = require('path');

const constants = Object.freeze({
  // Vizality
  WEBSITE: 'https://vizality.com',
  ASSETS: 'https://vizality.com/app/assets',
  IMAGES: 'https://vizality.com/app/assets/images',
  REPO: 'vizality/vizality',

  // Runtime
  SETTINGS_FOLDER: join(__dirname, '..', '..', '..', '..', 'settings'),
  CACHE_FOLDER: join(__dirname, '..', '..', '..', '..', '.cache'),
  LOGS_FOLDER: join(__dirname, '..', '..', '..', '..', '.logs'),

  // Dirs
  ROOT_FOLDER: join(__dirname, '..', '..', '..', '..'),
  PLUGINS_FOLDER: join(__dirname, '..', '..', '..', '..', 'addons', 'plugins'),
  THEMES_FOLDER: join(__dirname, '..', '..', '..', '..', 'addons', 'themes'),
  // --
    SRC_FOLDER: join(__dirname, '..', '..', '..'),
    // --
      VIZALITY_FOLDER: join(__dirname, '..', '..'),
      // ---
        API_FOLDER: join(__dirname, '..', '..', 'api'),
        CORE_FOLDER: join(__dirname, '..', '..', 'core'),
        I18N_FOLDER: join(__dirname, '..', '..', 'i18n'),
        LIBRARIES_FOLDER: join(__dirname, '..', '..', 'libraries'),
        MANAGERS_FOLDER: join(__dirname, '..', '..', 'managers'),
        STYLES_FOLDER: join(__dirname, '..', '..', 'styles'),
        MODULES_FOLDER: join(__dirname, '..'),


  // Discord Server
  INVITE_CODE: '42B8AC9',
  GUILD_ID: '689933814864150552',
  MAGIC_CHANNELS: {
    CSS_SNIPPETS: '705262981214371902',
    JS_SNIPPETS: '705262981214371902',
    STORE_PLUGINS: '700461738004578334',
    STORE_THEMES: '700461710972157954',
    STAFF_LOUNGE: '690452551233175602',
    SUPPORT: {
      INSTALLATION: '718478897695424613',
      PLUGINS: '705264484528291956',
      THEMES: '705264431831187496'
    }
  }
});

module.exports = constants;
