const { join } = require('path');

const constants = Object.freeze({
  // Vizality
  CDN: Object.freeze({
    WEBSITE_CDN: 'https://vizality.com',
    API_CDN: 'https://vizality.com/app/api',
    DOCS_CDN: 'https://vizality.com/app/api/docs',
    ASSETS_CDN: 'https://vizality.com/app/assets',
    IMAGES_CDN: 'https://vizality.com/app/assets/images'
  }),

  // Github
  REPO: Object.freeze({
    VIZALITY_REPO: 'vizality/vizality',
    COMMUNITY_REPO: 'vizality/vizality-community',
    DOCS_REPO: 'vizality/vizality-docs',
    I18N_REPO: 'vizality/vizality-i18n'
  }),

  // Directories
  DIR: Object.freeze({
    SETTINGS_DIR: join(__dirname, '..', '..', '..', '..', 'settings'),
    CACHE_DIR: join(__dirname, '..', '..', '..', '..', '.cache'),
    LOGS_DIR: join(__dirname, '..', '..', '..', '..', '.logs'),
    ROOT_DIR: join(__dirname, '..', '..', '..', '..'),
    SRC_DIR: join(__dirname, '..', '..', '..'),
    VIZALITY_DIR: join(__dirname, '..', '..'),
    // ---
    ADDONS_DIR: join(__dirname, '..', '..', '..', '..', 'addons'),
    PLUGINS_DIR: join(__dirname, '..', '..', '..', '..', 'addons', 'plugins'),
    BUNDLED_DIR: join(__dirname, '..', '..', '..', '..', 'addons', 'plugins', '.bundled'),
    CORE_DIR: join(__dirname, '..', '..', '..', '..', 'addons', 'plugins', '.core'),
    THEMES_DIR: join(__dirname, '..', '..', '..', '..', 'addons', 'themes'),
    // ---
    API_DIR: join(__dirname, '..', '..', 'api'),
    I18N_DIR: join(__dirname, '..', '..', 'i18n'),
    LIBRARIES_DIR: join(__dirname, '..', '..', 'libraries'),
    MANAGERS_DIR: join(__dirname, '..', '..', 'managers'),
    STYLES_DIR: join(__dirname, '..', '..', 'styles'),
    MODULES_DIR: join(__dirname, '..')
  }),

  // Discord Server
  GUILD: Object.freeze({
    GUILD_INVITE: '42B8AC9',
    GUILD_ID: '689933814864150552',
    // ---
    CHANNEL: Object.freeze({
      CSS_SNIPPETS_CHANNEL: '705262981214371902',
      JS_SNIPPETS_CHANNEL: '705262981214371902',
      PLUGINS_CHANNEL: '700461738004578334',
      THEMES_CHANNEL: '700461710972157954',
      DEVELOPMENT_CHANNEL: '690452269753171998',
      STAFF_CHANNEL: '690452551233175602',
      // ---
      SUPPORT_CHANNEL: Object.freeze({
        INSTALLATION_SUPPORT_CHANNEL: '718478897695424613',
        PLUGINS_SUPPORT_CHANNEL: '705264484528291956',
        THEMES_SUPPORT_CHANNEL: '705264431831187496',
        MISC_SUPPORT_CHANNEL: '705264513728905266'
      })
    })
  })
});

module.exports = constants;
