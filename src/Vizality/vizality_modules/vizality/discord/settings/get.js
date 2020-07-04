const { getModule } = require('vizality/webpack');
const { logger: { warn } } = require('vizality/util');

module.exports = function get (setting) {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:get';

  const settings = getModule([ 'renderEmbeds', 'renderReactions', 'renderSpoilers' ], false);

  if (!setting) return settings;

  /**
   * @todo: Add `friendSourceFlags` and `restrictedGuilds`
   */
  switch (setting) {
    case 'afkTimeout':
    case 'animateEmoji':
    case 'convertEmoticons':
    case 'customStatus':
    case 'defaultGuildsRestricted':
    case 'detectPlatformAccounts':
    case 'developerMode':
    case 'enableTTSCommand':
    case 'explicitContentFilter':
    case 'expressionPickerWidth':
    case 'gifAutoPlay':
    case 'inlineAttachmentMedia':
    case 'inlineEmbedMedia':
    case 'locale':
    case 'messageDisplayCompact':
    case 'renderEmbeds':
    case 'renderReactions':
    case 'renderSpoilers':
    case 'showCurrentGame':
    case 'status':
    case 'theme':
    case 'timezoneOffset':
    case 'useRichChatTextBox':
      return settings[setting];
    case 'allowTts':
      return settings.enableTTSCommand;
    case 'displayCompact':
      return settings.messageDisplayCompact;
    case 'showEmbeds':
      return settings.renderEmbeds;
    case 'showReactions':
      return settings.renderReactions;
    case 'showSpoilers':
      return settings.renderSpoilers;
    default:
      return settings[setting] || warn(MODULE, SUBMODULE, null, `Info on '${setting}' is not available.`);
  }
};
