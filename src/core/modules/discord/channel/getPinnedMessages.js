// vizality.modules.webpack.getModule('getPinnedMessages').getPinnedMessages('690477562857521174')
// channelId {Object|null}

/**
 * Gets the specified channel's pinned messages.
 * @param {snowflake} channelId Channel ID
 * @returns {object|null}
 */
export const getPinnedMessages = (channelId) => {
  try {
    return getModule('getPinnedMessages').getPinnedMessages(channelId);
  } catch (err) {
    this._error(err);
  }
};
