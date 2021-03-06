const { logger: { warn } } = require('@vizality/util');
const { getModule } = require('@vizality/webpack');

const getSettingInfo = require('./getSettingInfo');

const _module = 'Module';
const _submodule = 'Discord:settings:getSetting';

module.exports = (setting) => {
  if (!setting) return getSettingInfo();

  const settings = getModule('renderEmbeds', 'renderReactions', 'renderSpoilers');
  const moreSettings = getModule('darkSidebar', 'fontScale', 'fontSize');

  /*
   * @todo: Add `friendSourceFlags` and `restrictedGuilds`
   */
  switch (setting) {
    // @todo: Add these to getSettingInfo
    case 'darkSidebar':
    case 'fontScale':
    case 'fontSize':
    case 'messageGroupSpacing':
    case 'zoom':
    case 'isFontScaledUp':
    case 'isFontScaledDown':
    case 'isMessageGroupSpacingIncreased':
    case 'isMessageGroupSpacingDecreased':
    case 'isZoomedIn':
    case 'isZoomedOut':
      return moreSettings[setting];
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
      return settings[setting] || moreSettings[setting] || warn(_module, _submodule, null, `'${setting}' is not an available setting.`);
  }
};
