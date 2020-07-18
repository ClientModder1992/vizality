const { logger: { log, warn } } = require('vizality/util');

const getSettingInfo = (setting) => {
  const MODULE = 'Module';
  const SUBMODULE = 'Discord:settings:getSettingInfo';

  const SETTINGS_INFO = {
    afkTimeout: [
      'The number of seconds Discord will wait for activity before sending mobile push notifications.',
      'Configurable in the \'Notifications\' settings section.'
    ],
    animateEmoji: [
      'Whether to convert ASCII emoticons to emoji.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    convertEmoticons: [
      'Whether to allow playing text-to-speech messages.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    customStatus: [
      'Returns the object with your custom status.',
      'Accessible values are at \'emojiName\', \'expiresAt\', and \'text\'.',
      'Accessible via the \'Status Picker\' popout.',
      'Configurable in the \'Custom Status\' modal.'
    ],
    defaultGuildsRestricted: [
      'Whether to disallow direct messages from server members by default.',
      'Configurable in the \'Privacy & Safety\' settings section.'
    ],
    detectPlatformAccounts: [
      'Whether to automatically add accounts from other platforms running on the user\'s computer.',
      'Configurable in the \'Connections\' settings section.'
    ],
    developerMode: [
      'Whether the user has enabled developer mode.',
      'Currently only adds a \'Copy ID\' option to context menus.',
      'Configurable in the \'Appearance\' settings section.'
    ],
    enableTTSCommand: [
      'Whether to allow playing text-to-speech messages.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    explicitContentFilter: [
      'The user\'s selected explicit content filter level.',
      '0 == off, 1 == everyone except friends, 2 == everyone',
      'Configurable in the \'Privacy & Safety\' settings section.'
    ],
    expressionPickerWidth: [
      'The size of the GIF / Emoji Picker popout.',
      'Either \'min\', \'max\', or a unitless pixel integer value.',
      'Configurable by dragging the width of the GIF / Emoji Picker popout.'
    ],
    gifAutoPlay: [
      'Whether to automatically play GIFs when the Discord window is active without having to hover the mouse over the image.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    inlineAttachmentMedia: [
      'Whether to show images uploaded directly to Discord.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    inlineEmbedMedia: [
      'Whether to show images linked in Discord.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    locale: [
      'The user\'s selected language code.',
      'Configurable in the \'Language\' settings section.'
    ],
    messageDisplayCompact: [
      'Whether the user has enabled compact mode.',
      '\'true\' if compact mode is enabled, \'false\' if cozy mode is enabled.',
      'Configurable in the \'Appearance\' settings section.'
    ],
    renderEmbeds: [
      'Whether to show content from http/https links as embeds.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    renderReactions: [
      'Whether to show a message\'s reactions.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    renderSpoilers: [
      'Whether to show content from HTTP[s] links as embeds.',
      'Either \'ON_CLICK\', \'IF_MODERATOR\', or \'ALWAYS\'.',
      'Configurable in the \'Text & Images\' settings section.'
    ],
    showCurrentGame: [
      'Whether to display the currently running game as a status message.',
      'Configurable in the \'Game Activity\' settings section.'
    ],
    status: [
      'The user\'s current status.',
      'Either \'online\', \'idle\', \'dnd\', or \'invisible\'.',
      'Configurable in the \'Status Picker\' popout.'
    ],
    theme: [
      'The user\'s selected theme.',
      'Either \'dark\', \'light\', or \'null\'.',
      'Configurable in the \'Appearance\' settings section.'
    ],
    timezoneOffset: [
      'The user\'s timezone offset in hours.',
      'This is not configurable.'
    ],
    useRichChatTextBox: [
      'Whether to preview emojis, mentions, and markdown syntax as you type.',
      'Configurable in the \'Text & Images\' settings section.'
    ]
  };

  /*
   * Assign aliases to the proper values.
   */
  SETTINGS_INFO.allowTts = SETTINGS_INFO.enableTTSCommand;
  SETTINGS_INFO.displayCompact = SETTINGS_INFO.messageDisplayCompact;
  SETTINGS_INFO.showEmbeds = SETTINGS_INFO.renderEmbeds;
  SETTINGS_INFO.showReactions = SETTINGS_INFO.renderReactions;
  SETTINGS_INFO.showSpoilers = SETTINGS_INFO.renderSpoilers;

  if (!setting) {
    log(MODULE, SUBMODULE, null, 'List of available settings:');
    return Object.keys(SETTINGS_INFO);
  }

  for (const info of Object.keys(SETTINGS_INFO)) {
    if (info === setting) {
      return SETTINGS_INFO[info].forEach(descriptor => log(MODULE, SUBMODULE, null, descriptor));
    }
  }

  return warn(MODULE, SUBMODULE, null, `Info on '${setting}' is not available.`);
};

module.exports = getSettingInfo;
