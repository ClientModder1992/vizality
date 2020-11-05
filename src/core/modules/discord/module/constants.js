const { getModule } = require('@vizality/webpack');

const constants = {
  ...getModule('Permissions', 'ActivityTypes', 'StatusTypes'),
  DEFAULT_AVATARS: {
    ...getModule('DEFAULT_AVATARS').DEFAULT_AVATARS
  },
  DEFAULT_GROUP_DM_AVATARS: {
    ...getModule('DEFAULT_GROUP_DM_AVATARS').DEFAULT_GROUP_DM_AVATARS
  },
  EMOJI_CATEGORIES: {
    ...getModule('getGuildEmoji').categories
  }
};

module.exports = constants;
