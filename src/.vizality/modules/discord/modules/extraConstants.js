const { getModule } = require('@webpack');

const extraConstants = {
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

module.exports = extraConstants;
