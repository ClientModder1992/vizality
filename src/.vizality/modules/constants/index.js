const { join } = require('path');

const constants = module.exports = Object.freeze({
  // Vizality
  HTTP: Object.freeze({
    WEBSITE: 'https://vizality.com',
    TRELLO: 'https://trello.com/vizality',
    get API () { return `${constants.HTTP.WEBSITE}/app/api`; },
    get DOCS () { return `${constants.HTTP.API}/docs`; },
    get ASSETS () { return `${constants.HTTP.WEBSITE}/app/assets`; },
    get IMAGES () { return `${constants.HTTP.ASSETS}/images`; }
  }),

  // GitHub
  Repositories: Object.freeze({
    ORG: 'vizality',
    get VIZALITY () { return `${constants.Repositories.ORG}/vizality`; },
    get COMMUNITY () { return `${constants.Repositories.ORG}/vizality-community`; },
    get DOCS () { return `${constants.Repositories.ORG}/vizality-docs`; },
    get I18N () { return `${constants.Repositories.ORG}/vizality-i18n`; }
  }),

  // Directories
  Directories: Object.freeze({
    ROOT: join(__dirname, '..', '..', '..', '..'),
    get SRC () { return join(constants.Directories.ROOT, 'src'); },
    get VIZALITY () { return join(constants.Directories.SRC, '.vizality'); },
    // ---
    get SETTINGS () { return join(constants.Directories.ROOT, 'settings'); },
    get CACHE () { return join(constants.Directories.ROOT, '.cache'); },
    get LOGS () { return join(constants.Directories.ROOT, '.logs'); },
    // ---
    get ADDONS () { return join(constants.Directories.ROOT, 'addons'); },
    get PLUGINS () { return join(constants.Directories.ADDONS, 'plugins'); },
    get BUILTINS () { return join(constants.Directories.VIZALITY, 'builtins'); },
    get BUNDLED () { return join(constants.Directories.PLUGINS, '.bundled'); },
    get CORE () { return join(constants.Directories.PLUGINS, '.core'); },
    get THEMES () { return join(constants.Directories.ADDONS, 'themes'); },
    // ---
    get API () { return join(constants.Directories.VIZALITY, 'api'); },
    get I18N () { return join(constants.Directories.VIZALITY, 'i18n'); },
    get LIBRARIES () { return join(constants.Directories.VIZALITY, 'libraries'); },
    get MANAGERS () { return join(constants.Directories.VIZALITY, 'managers'); },
    get STYLES () { return join(constants.Directories.VIZALITY, 'styles'); },
    get MODULES () { return join(__dirname, '..'); }
  }),

  // Guild
  Guild: Object.freeze({
    INVITE: '42B8AC9',
    ID: '689933814864150552'
  }),

  // Channels
  Channels: Object.freeze({
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
  }),

  // Errors
  ErrorTypes: Object.freeze({
    // Misc
    NOT_A_DIRECTORY: 'NOT_A_DIRECTORY',
    // Addons
    MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
    INVALID_MANIFEST: 'INVALID_MANIFEST'
  })
});
