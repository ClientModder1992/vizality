const { join } = require('path');

module.exports = Object.freeze({
  // Vizality
  WEBSITE: 'https://vizality.com',
  WEBSITE_ASSETS: 'https://vizality.com/app/assets',
  WEBSITE_IMAGES: 'https://vizality.com/app/assets/images',
  REPO_URL: 'vizality/vizality',

  // Runtime
  SETTINGS_FOLDER: join(__dirname, '..', '..', '..', '..', '..', 'settings'),
  CACHE_FOLDER: join(__dirname, '..', '..', '..', '..', '..', '.cache'),
  LOGS_FOLDER: join(__dirname, '..', '..', '..', '..', '..', '.logs'),

  // Discord Server
  INVITE_CODE: '42B8AC9',
  GUILD_ID: '689933814864150552',
  MAGIC_CHANNELS: {
    CSS_SNIPPETS: '705262981214371902',
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
