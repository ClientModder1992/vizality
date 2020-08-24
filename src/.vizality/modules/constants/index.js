const path = require('path');

// HTTP
exports.HTTP = Object.freeze({
  WEBSITE: 'https://vizality.com',
  API: 'https://vizality.com/app/api',
  DOCS: 'https://vizality.com/app/api/docs',
  ASSETS: 'https://vizality.com/app/assets',
  IMAGES: 'https://vizality.com/app/assets/images'
});

// Github
exports.Repositories = Object.freeze({
  VIZALITY: 'vizality/vizality',
  COMMUNITY: 'vizality/vizality-community',
  DOCS: 'vizality/vizality-docs',
  I18N: 'vizality/vizality-i18n'
});

// Directories
exports.Directories = Object.freeze({
  SETTINGS: path.join(__dirname, '..', '..', '..', '..', 'settings'),
  CACHE: path.join(__dirname, '..', '..', '..', '..', '.cache'),
  LOGS: path.join(__dirname, '..', '..', '..', '..', '.logs'),
  ROOT: path.join(__dirname, '..', '..', '..', '..'),
  SRC: path.join(__dirname, '..', '..', '..'),
  VIZALITY: path.join(__dirname, '..', '..'),
  // ---
  ADDONS: path.join(__dirname, '..', '..', '..', '..', 'addons'),
  PLUGINS: path.join(__dirname, '..', '..', '..', '..', 'addons', 'plugins'),
  BUNDLED: path.join(__dirname, '..', '..', '..', '..', 'addons', 'plugins', '.bundled'),
  CORE: path.join(__dirname, '..', '..', '..', '..', 'addons', 'plugins', '.core'),
  THEMES: path.join(__dirname, '..', '..', '..', '..', 'addons', 'themes'),
  // ---
  API: path.join(__dirname, '..', '..', 'api'),
  I18N: path.join(__dirname, '..', '..', 'i18n'),
  LIBRARIES: path.join(__dirname, '..', '..', 'libraries'),
  MANAGERS: path.join(__dirname, '..', '..', 'managers'),
  STYLES: path.join(__dirname, '..', '..', 'styles'),
  MODULES: path.join(__dirname, '..')
});

// Guild
exports.Guild = Object.freeze({
  INVITE: '42B8AC9',
  ID: '689933814864150552',
});

// Channels
exports.Channels = Object.freeze({
  DEVELOPMENT: '690452269753171998',
  STAFF: '690452551233175602',
  // ---
  PLUGINS: '700461738004578334',
  THEMES: '700461710972157954',
  // ---
  CSS_SNIPPETS: '705262981214371902',
  JS_SNIPPETS: '705262981214371902',
  // ---
  INSTALLATION_SUPPORT: '718478897695424613',
  PLUGINS_SUPPORT: '705264484528291956',
  THEMES_SUPPORT: '705264431831187496',
  MISC_SUPPORT: '705264513728905266'
});

// Errors
exports.ErrorTypes = Object.freeze({
  // Addons
  NOT_A_DIRECTORY: 'NOT_A_DIRECTORY',
  MANIFEST_LOAD_FAILED: 'MANIFEST_LOAD_FAILED',
  INVALID_MANIFEST: 'INVALID_MANIFEST'
});
