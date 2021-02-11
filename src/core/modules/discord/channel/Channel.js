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
